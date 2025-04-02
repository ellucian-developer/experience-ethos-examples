// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

import log from 'loglevel';
const logger = log.getLogger('Today');

const allDaysOfWeek = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];

function getLocalIsoDate(date, offset = 0) {
    const localeDate = new Date(new Date(`${date}T00:00:00`).getTime() + offset);
    return localeDate.toISOString().slice(0, 10);
}

export async function todayClassesGraphQlQuery({ queryKeys, queryParameters }) {
    const { date = new Date(new Date().toLocaleDateString()).toISOString().slice(0, 10) } = queryKeys;
    const { getEthosQuery } = queryParameters;

    try {
        // the query needs yesterday and tomorrow dates
        const yesterday = getLocalIsoDate(date, -1000*60*60*24);
        const tomorrow = getLocalIsoDate(date, 1000*60*60*24);
        const properties = { yesterday, tomorrow };

        const result = await getEthosQuery({queryId: 'today-sections', properties});

        const sectionRegistrations = result?.data?.sectionRegistrations?.edges || [];

        const sections = [];
        if (sectionRegistrations) {
            const dataSections = sectionRegistrations.map( sectionRegistration => sectionRegistration.node.sections );
            const instructionalEventPromises = [];
            for (const section of dataSections) {
                const promise = getEthosQuery({queryId: 'instructional-events-by-section', properties: { sectionId: section.id }});
                instructionalEventPromises.push(promise);
            }

            const results = await Promise.all(instructionalEventPromises);

            // each result is for a single section, process each to find the sections with events today
            results.forEach( (result, index) => {
                const dataSection = dataSections[index];
                const { course: { number, subject: { abbreviation }, titles }, id} = dataSection;
                const title = titles && titles.length > 0 ? titles[0].value : '';

                const instructionalEvents = result?.data?.instructionalEvents?.edges;
                const events = instructionalEvents.map( edge => edge.node );

                const section = {
                    id,
                    course: {
                        abbreviation,
                        number,
                        title
                    },
                    instructionalEvents: []
                }

                let sectionMeetsOnDate = false;
                for ( const event of events ) {
                    const {
                        id,
                        locations: dataLocations,
                        recurrence: {
                            timePeriod: { startOn, endOn },
                            repeatRule: { type, daysOfWeek }
                        }
                    } = event;

                    const dateDayOfWeek = allDaysOfWeek[new Date(`${date}T00:00:00`).getDay()];

                    const locations = dataLocations.map( dataLocation => {
                        const { location: { room: { building: { title: buildingTitle }, number: roomNumber } } } = dataLocation;

                        return { buildingTitle, roomNumber };
                    })

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
                    sections.push(section);
                }
            });
        }

        return { data: sections };
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return { error };
    }
}
