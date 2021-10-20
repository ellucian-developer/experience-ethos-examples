/* eslint-disable max-depth */

import { fetchJsonData } from './json-data';

const allDaysOfWeek = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];

export async function fetchTodayClassesWithGraphQLProxy({getEthosQuery}) {
    try {
        // the query needs yesterday and tomorrow dates
        const start = new Date();
        const now = process.env.DATE ? new Date(process.env.DATE) : new Date();
        const yesterday = new Date(now.getTime() - (1000*60*60*24)).toISOString().slice(0, 10);
        const tomorrow = new Date(now.getTime() + (1000*60*60*24)).toISOString().slice(0, 10);
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
                            startOn: `${now.toISOString().slice(0, 10)}${startOn.slice(10)}`,
                            endOn: `${now.toISOString().slice(0, 10)}${endOn.slice(10)}`,
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

        console.log('fetchTodayClassesWithGraphQLProxy time:', new Date().getTime() - start.getTime());
        return sections;
    } catch (error) {
        console.error('unable to fetch data sources: ', error);
        return {data: [], error: error.message};
    }
}

export async function fetchTodayClassesFromLambda({ getExtensionJwt, url: urlBase }) {
    try {
        const start = new Date();
        const now = process.env.DATE ? new Date(process.env.DATE) : new Date();

        // send browser date rather than using server's
        const date = new Date(now.toLocaleDateString()).toISOString().slice(0, 10);

        const searchParams = new URLSearchParams();
        searchParams.append('date', date);
        const url = `${urlBase}?${searchParams.toString()}`

        const {data: sections = []} = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        console.log('fetchTodayClassesFromLambda time:', new Date().getTime() - start.getTime());
        return  sections;
    } catch (error) {
        console.error('unable to fetch data sources: ', error);
        return {data: [], error: error.message};
    }
}

export async function fetchTodayClassesFromNode({ getExtensionJwt, url: urlBase }) {
    try {
        const start = new Date();
        const now = process.env.DATE ? new Date(process.env.DATE) : new Date();

        // send browser date rather than using server's
        const date = new Date(now.toLocaleDateString()).toISOString().slice(0, 10);

        // build URL
        const url = new URL(urlBase);
        const searchParams = new URLSearchParams(url.searchParams);
        searchParams.append('date', date);
        url.search = searchParams.toString();

        const {data: sections = []} = await fetchJsonData({
            url,
            getJwt: getExtensionJwt
        });

        console.log('fetchTodayClassesFromLambda time:', new Date().getTime() - start.getTime());
        return  sections;
    } catch (error) {
        console.error('unable to fetch data sources: ', error);
        return {data: [], error: error.message};
    }
}
