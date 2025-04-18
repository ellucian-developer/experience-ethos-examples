// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import { StatusCodes } from 'http-status-codes';
import { experienceUtil, integrationUtil } from '@ellucian/experience-extension-server-util';

import { logUtil } from '@ellucian/experience-extension-server-util';
const logger = logUtil.getLogger();

const allDaysOfWeek = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];

async function getSectionRegistrationsForPerson({apiKey, context, personId}) {
    const {data: sectionRegistrations} = await integrationUtil.get({
        apiKey,
        context,
        resource: 'section-registrations',
        searchParams: {
            criteria: {
                registrant: {
                    id: personId
                }
            }
        }
    });
    
    return sectionRegistrations;
}

async function getSectionsByIds({apiKey, context, sectionIds}) {
    const promises = sectionIds.map(sectionId => {
        return integrationUtil.get({
            apiKey,
            context,
            id: sectionId,
            resource: 'sections'
        });
    });

    const results = await Promise.all(promises);
    return results.map(result => result.data);
}

async function getInstructionalEvents({apiKey, context, sectionIds}) {
    const promises = sectionIds.map(sectionId => {
        const instructionalEventsVersion = process.env.RESOURCE_INSTRUCTIONAL_EVENTS_VERSION || 'v11';
        const searchParams = instructionalEventsVersion === 'v11' ?
            {
                criteria: {
                    section: { id: sectionId }
                }
            } : {
                criteria: {
                    section: sectionId
                }
            };

        return integrationUtil.get({
            apiKey,
            context,
            resource: 'instructional-events',
            searchParams,
            options: {
                headers: {
                    'Accept': `application/vnd.hedtech.integration.${instructionalEventsVersion}+json`
                }
            }
        });
    });

    const results = await Promise.all(promises);

    const resultMap = {};
    sectionIds.forEach((sectionId, index) => {
        const {data: instructionalEvents} = results[index] || {};
        resultMap[sectionId] = instructionalEvents || [];
    });

    return resultMap;
}

async function getLocationDetails({apiKey, context, resultSections}) {
    const promises = [];
    for (const section of resultSections) {
        for (const event of section.instructionalEvents) {
            const {locations} = event;

            event.locations = [];

            if (Array.isArray(locations)) {
                for(const location of locations) {
                    const {location: {room: {id: roomId}, type}} = location;
                    if (type === 'room') {
                        promises.push((async () => {
                            // Room
                            const {data: room} = await integrationUtil.get({
                                apiKey,
                                context,
                                id: roomId,
                                resource: 'rooms'
                            });

                            // Building
                            const {building: {id: buildingId}} = room;
                            const {data: building} = await integrationUtil.get({
                                apiKey,
                                context,
                                id: buildingId,
                                resource: 'buildings'
                            });

                            event.locations.push({
                                buildingTitle: building.title,
                                roomNumber: room.number
                            });
                        })());
                    }
                }
            }
        }
    }

    await Promise.all(promises);
}

async function getCourseDetails({apiKey, context, resultSections}) {
    const promises = [];
    for (const section of resultSections) {
        const {courseId} = section;
        promises.push((async () => {
            // Course
            const {data: course} = await integrationUtil.get({
                apiKey,
                context,
                id: courseId,
                resource: 'courses'
            });
            
            // Subject
            const {number, subject: {id: subjectId}, titles} = course;
            const title = titles && titles.length > 0 ? titles[0].value : '';
            const {data: subject} = await integrationUtil.get({
                apiKey,
                context,
                id: subjectId,
                resource: 'subjects'
            });

            delete section.courseId;

            const {abbreviation} = subject;
            section.course = {
                abbreviation,
                number,
                title
            };
        })());
    }

    await Promise.all(promises);
}

export async function getTodayClasses(personId, date, jwt) {
    logger.debug(`getTodayClasses personId: ${personId} date: ${date}`);

    const { card: { cardServerConfigurationApiUrl }} = jwt;

    const { config, error } = await experienceUtil.getCardServerConfiguration({
        url: cardServerConfigurationApiUrl,
        token: process.env.EXTENSION_API_TOKEN
    });

    const { ethosApiKey } = config || {};

    if (!config || !ethosApiKey || error) {
        const response = { error: {}};
        if (error) {
            response.error.message = error.message;
            response.error.statusCode = error.statusCode;
        } else if (config) {
            response.error.message = 'Unable to get apiKey from card server configuration at URL';
            response.error.statusCode = StatusCodes.NOT_FOUND;
        } else {
            response.error.message = 'Unable to get card server configuration at URL';
            response.error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        response.error.cardServerConfigurationApiUrl = cardServerConfigurationApiUrl;

        return response;
    }

    const eventDate = date ? new Date(`${date}T00:00:00`): new Date();

    const context = {};

    // Section Registrations
    const sectionRegistrations = await getSectionRegistrationsForPerson({apiKey: ethosApiKey, context, personId});

    if (!sectionRegistrations) {
        logger.error('failed to get section-registrations');
    }

    const sectionIds = sectionRegistrations.map(sectionRegistration => sectionRegistration.section.id);
    const sections = await getSectionsByIds({apiKey: ethosApiKey, context, sectionIds});

    const filteredSections = sections.filter(section => {
        const {endOn, startOn} = section;
        const startOnDate = new Date(startOn);
        const endOnDate = new Date(endOn);
        return eventDate >= startOnDate && eventDate <= endOnDate;
    });

    const filteredSectionIds = filteredSections.map(section => section.id);
    const instructionalEventsBySectionId = await getInstructionalEvents({apiKey: ethosApiKey, context, sectionIds: filteredSectionIds});

    const resultSections = [];
    for (const section of filteredSections) {
        const {course: {id: courseId}, id: sectionId} = section;
        const instructionalEvents = instructionalEventsBySectionId[sectionId];

        // look for Instructional Events that meet today
        let meetsOnDate = false;
        const events = [];
        for (const instructionalEvent of instructionalEvents) {
            const {
                id: instructionalEventId,
                locations,
                recurrence: {
                    repeatRule: {daysOfWeek, type},
                    timePeriod: {endOn, startOn}
                }
            } = instructionalEvent;
            const startOnDate = new Date(startOn);
            const endOnDate = new Date(endOn);

            if (eventDate < startOnDate || eventDate > endOnDate) {
                // skip this one
                continue;
            }

            const dateDayOfWeek = allDaysOfWeek[eventDate.getDay()];
            if (type === 'weekly') {
                meetsOnDate = Boolean(daysOfWeek && Array.isArray(daysOfWeek) && daysOfWeek.includes(dateDayOfWeek));
            }

            if (meetsOnDate) {
                events.push({
                    id: instructionalEventId,
                    startOn,
                    endOn,
                    locations
                });
            }
        }

        if (meetsOnDate) {
            resultSections.push({
                courseId,
                instructionalEvents: events
            });
        }
    }

    await getLocationDetails({apiKey: ethosApiKey, context, resultSections});

    await getCourseDetails({apiKey: ethosApiKey, context, resultSections});
    logger.debug('resultSections', resultSections);
    logger.debug('Ethos GET count:', context.ethosGetCount);

    return { data: resultSections };
}
