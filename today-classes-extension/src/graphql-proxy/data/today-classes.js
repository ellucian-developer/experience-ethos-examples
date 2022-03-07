// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

import log from 'loglevel';
const logger = log.getLogger('Today');

const allDaysOfWeek = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];

function getLocalIsoDate(date) {
    const month = date.getMonth() + 1;
    const monthString = month < 10 ? `0${month}` : `${month}`;
    const day = date.getDate();
    const dayString = day < 10 ? `0${day}` : `${day}`;
    return `${date.getFullYear()}-${monthString}-${dayString}`;
}

export async function fetchTodayClasses({getEthosQuery}) {
    try {
        // the query needs yesterday and tomorrow dates
        const start = new Date();
        const now = process.env.DATE ? new Date(process.env.DATE) : new Date();
        const yesterday = getLocalIsoDate(new Date(now.getTime() - (1000*60*60*24)));
        const tomorrow = getLocalIsoDate(new Date(now.getTime() + (1000*60*60*24)));
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

                    const dateDayOfWeek = allDaysOfWeek[now.getDay()];

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
                    // keep this one
                    sections.push(section);
                }
            });
        }

        logger.debug('GraphQL Proxy fetchTodayClasses time:', new Date().getTime() - start.getTime());
        return { data: sections };
    } catch (error) {
        logger.error('unable to fetch data sources: ', error);
        return { error };
    }
}
