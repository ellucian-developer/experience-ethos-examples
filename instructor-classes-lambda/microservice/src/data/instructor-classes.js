// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import { integrationUtil } from '@ellucian/experience-extension-server-util';
import { instructionalEventsBySectionV8, instructionalEventsBySectionV11, instructorsSections } from './queries';

import { logUtil } from '@ellucian/experience-extension-server-util';
const logger = logUtil.getLogger();

export async function fetchInstructorClasses ({ apiKey, personId }) {
    try {
        // the query needs yesterday and tomorrow dates
        const start = new Date();
        logger.debug('apiKey', apiKey);
        logger.debug('instructorSections', instructorsSections);
        const variables = {
            instructorId: personId
        };
        logger.debug('variables', variables);

        const ethosContext = {};
        const sectionsResult = await integrationUtil.graphql({ apiKey, context: ethosContext, query: instructorsSections, variables });

        console.log('sectionResult', JSON.stringify(sectionsResult, null, 2));

        // check for error(s)
        const errors = sectionsResult?.errors;
        if (errors && Array.isArray(errors)) {
            // use the first error message
            return { data: [], error: errors[0].message };
        }
        const sectionInstructors = sectionsResult?.data?.sectionInstructors?.edges;

        const sections = [];

        if (sectionInstructors && Array.isArray(sectionInstructors) && sectionInstructors.length > 0) {
            const dataSections = sectionInstructors.map(sectionRegistration => sectionRegistration.node.sections);
            const instructionalEventPromises = [];
            for (const section of dataSections) {
                const promise =
                    integrationUtil.graphql({
                        apiKey,
                        context: ethosContext,
                        query: process.env.RESOURCE_INSTRUCTIONAL_EVENTS_VERSION === 'v11' ?
                            instructionalEventsBySectionV11 : instructionalEventsBySectionV8,
                        variables: {
                            sectionId: section.id
                        }
                    });
                instructionalEventPromises.push(promise);
            }

            const results = await Promise.all(instructionalEventPromises);

            // each result is for a single section, process each
            results.forEach((result, index) => {
                const dataSection = dataSections[index];
                const { course: { number, subject: { abbreviation }, titles } } = dataSection;
                const title = titles && titles.length > 0 ? titles[0].value : '';

                // check for error(s)
                const errors = result?.errors;
                if (errors && Array.isArray(errors)) {
                    // use the first error message
                    return { data: [], error: errors[0].message };
                }
                const instructionalEvents = result?.data?.instructionalEvents?.edges || [];
                const events = instructionalEvents.map(edge => edge.node);

                const section = {
                    course: {
                        abbreviation,
                        number,
                        title
                    },
                    instructionalEvents: []
                };

                for (const event of events) {
                    const {
                        id,
                        locations: dataLocations,
                        recurrence: {
                            timePeriod: { startOn, endOn }
                        }
                    } = event;

                    const locations = dataLocations.map(dataLocation => {
                        const { location: { room: { building: { title: buildingTitle }, number: roomNumber } } } = dataLocation;

                        return { buildingTitle, roomNumber };
                    });

                    section.instructionalEvents.push({
                        id,
                        startOn,
                        endOn,
                        locations
                    });
                }

                sections.push(section);
            });
        } else {
            logger.debug(`user: ${personId} has no sections`);
        }

        logger.debug('time:', new Date().getTime() - start.getTime());
        logger.debug('Ethos GraphQL count:', ethosContext.ethosGraphQLCount);
        return sections;
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return { data: [], error: error.message };
    }
}
