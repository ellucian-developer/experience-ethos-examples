// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import { integrationUtil } from '@ellucian/experience-extension-server-util';
import { instructionalEventsBySectionV8, instructionalEventsBySectionV11, todaysSections } from './queries';

import { logUtil } from '@ellucian/experience-extension-server-util';
const logger = logUtil.getLogger();

const allDaysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function getLocalIsoDate(date) {
    const month = date.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const day = date.getDate();
    const dayString = day < 10 ? `0${day}` : `${day}`;
    return `${date.getFullYear()}-${monthString}-${dayString}`;
}

export async function fetchTodayClasses ({ apiKey, date, personId }) {
    try {
        // the query needs yesterday and tomorrow dates
        const start = new Date();
        const dateToUse = date || new Date().toISOString().slice(0, 10);
        // use midnight in current timezone on Date object
        const dateToUseDate = new Date(`${dateToUse}T00:00:00`);
        const yesterday = getLocalIsoDate(new Date(dateToUseDate.getTime() - (1000*60*60*24)));
        const tomorrow = getLocalIsoDate(new Date(dateToUseDate.getTime() + (1000*60*60*24)));
        logger.debug('yesterday', yesterday);
        logger.debug('tomorrow', tomorrow);
        const variables = {
            personId,
            yesterday,
            tomorrow
        };

        const ethosContext = {};
        logger.debug('query', todaysSections);
        logger.debug('variables', variables);
        const sectionsResult = await integrationUtil.graphql({ apiKey, context: ethosContext, query: todaysSections, variables });

        // check for error(s)
        const errors = sectionsResult?.errors;
        if (errors && Array.isArray(errors)) {
            // use the first error message
            return { data: [], error: errors[0].message };
        }
        const sectionRegistrations = sectionsResult?.data?.sectionRegistrations?.edges;

        const classesResult = {
            sections: []
        };

        if (sectionRegistrations && Array.isArray(sectionRegistrations) && sectionRegistrations.length > 0) {
            const dataSections = sectionRegistrations.map(sectionRegistration => sectionRegistration.node.sections);
            const instructionalEventPromises = [];
            for (const section of dataSections) {
                const query = process.env.RESOURCE_INSTRUCTIONAL_EVENTS_VERSION === 'v11' ?
                    instructionalEventsBySectionV11 : instructionalEventsBySectionV8;
                const variables = {
                    sectionId: section.id
                };
                logger.debug('query', query);
                logger.debug('variables', variables);
                const promise =
                    integrationUtil.graphql({
                        apiKey,
                        context: ethosContext,
                        query,
                        variables
                    });
                instructionalEventPromises.push(promise);
            }

            const results = await Promise.all(instructionalEventPromises);

            // each result is for a single section, process each to find the sections with events today
            for( const [index, result] of results.entries()) {
                const dataSection = dataSections[index];
                const { course: { number, subject: { abbreviation }, id: sectionId, titles } } = dataSection;
                const title = titles && titles.length > 0 ? titles[0].value : '';

                // check for error(s)
                const errors = result?.errors;
                if (errors && Array.isArray(errors)) {
                    // use the first error message
                    classesResult.error = errors[0];
                    break;
                }

                const instructionalEvents = result?.data?.instructionalEvents?.edges || [];
                const events = instructionalEvents.map(edge => edge.node);

                const section = {
                    id: sectionId,
                    course: {
                        abbreviation,
                        number,
                        title
                    },
                    instructionalEvents: []
                };
                logger.debug('section', section);

                let sectionMeetsOnDate = false;
                for (const event of events) {
                    const {
                        id,
                        locations: dataLocations,
                        recurrence: {
                            timePeriod: { startOn, endOn },
                            repeatRule: { type, daysOfWeek }
                        }
                    } = event;

                    const dateDayOfWeek = allDaysOfWeek[dateToUseDate.getDay()];

                    const locations = dataLocations.map(dataLocation => {
                        const { location: { room: { building: { title: buildingTitle }, number: roomNumber } } } = dataLocation;

                        return { buildingTitle, roomNumber };
                    });

                    let meetsOnDate = false;
                    if (type === 'weekly') {
                        meetsOnDate = Boolean(daysOfWeek && Array.isArray(daysOfWeek) && daysOfWeek.includes(dateDayOfWeek));
                    }

                    sectionMeetsOnDate = sectionMeetsOnDate || meetsOnDate;

                    if (meetsOnDate) {
                        section.instructionalEvents.push({
                            id,
                            startOn,
                            endOn,
                            locations
                        });
                    }
                }

                if (sectionMeetsOnDate) {
                    // keep this one
                    classesResult.sections.push(section);
                }
            }
        } else {
            logger.debug(`user: ${personId} has no sections for date: ${date}`);
        }

        logger.debug('time:', new Date().getTime() - start.getTime());
        logger.debug('Ethos GraphQL count:', ethosContext.ethosGraphQLCount);
        return classesResult;
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return { data: [], error: error.message };
    }
}
