import { integrationUtil } from '@ellucian/experience-extension-server-util';
import { instructionalEventsBySectionV8, instructionalEventsBySectionV11, todaysSections } from './queries';

const allDaysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export async function fetchTodayClasses ({ apiKey, date, personId }) {
    try {
        // the query needs yesterday and tomorrow dates
        const start = new Date();
        const dateToUse = date || new Date().toISOString().slice(0, 10);
        // use midnight in current timezone on Date object
        const dateToUseDate = new Date(`${dateToUse}T00:00:00`);
        const yesterday = new Date(dateToUseDate.getTime() - (1000 * 60 * 60 * 24)).toISOString().slice(0, 10);
        const tomorrow = new Date(dateToUseDate.getTime() + (1000 * 60 * 60 * 24)).toISOString().slice(0, 10);
        const variables = {
            personId,
            yesterday,
            tomorrow
        };

        const ethosContext = {};
        const sectionsResult = await integrationUtil.graphql({ apiKey, context: ethosContext, query: todaysSections, variables });
        const sectionRegistrations = sectionsResult?.data?.sectionRegistrations?.edges;

        const sections = [];

        if (sectionRegistrations && Array.isArray(sectionRegistrations) && sectionRegistrations.length > 0) {
            const dataSections = sectionRegistrations.map(sectionRegistration => sectionRegistration.node.sections);
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

            // each result is for a single section, process each to find the sections with events today
            results.forEach((result, index) => {
                const dataSection = dataSections[index];
                const { course: { number, subject: { abbreviation }, titles } } = dataSection;
                const title = titles && titles.length > 0 ? titles[0].value : '';

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
                            startOn: `${dateToUseDate.toISOString().slice(0, 10)}${startOn.slice(10)}`,
                            endOn: `${dateToUseDate.toISOString().slice(0, 10)}${endOn.slice(10)}`,
                            locations
                        });
                    }
                }

                if (sectionMeetsOnDate) {
                    // keep this one
                    sections.push(section);
                }
            });
        } else {
            if (process.env.DEBUG === 'true') {
                console.debug(`user: ${personId} has no sections for date: ${date}`);
            }
        }

        if (process.env.DEBUG === 'true') {
            console.debug('time:', new Date().getTime() - start.getTime());
            console.debug('Ethos GraphQL count:', ethosContext.ethosGraphQLCount);
        }
        return sections;
    } catch (error) {
        console.error('unable to fetch data sources: ', error);
        return { data: [], error: error.message };
    }
}
