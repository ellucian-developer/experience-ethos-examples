module.exports = {
    name: 'today-classes-graphql',
    publisher: '',
    cards: [{
        type: 'TodayClassesGraphQL',
        source: './src/cards/TodayClasses.jsx',
        title: 'Today\'s Classes - GraphQL',
        displayCardType: 'Today\'s Classes - GraphQL',
        description: 'Today\'s Classes via GraphQL',
        queries: {
            'instructional-events-by-section': [{
                resourceVersions: {
                buildings: { min: 6 },
                instructionalEvents: { min: 8 },
                rooms: { min: 10 },
                sections: { min: 16 }
                },
                query: `
                    query instructionalEventsBySection($sectionId: ID){
                        instructionalEvents : {instructionalEvents}(
                            filter: {
                                {section}: {
                                id: {EQ: $sectionId}
                                }
                            }
                        ){
                            edges {
                                node {
                                    id
                                    recurrence {
                                        timePeriod {
                                            startOn,
                                            endOn
                                        }
                                        repeatRule {
                                            type
                                            interval
                                            ends {
                                                repetitions,
                                                date
                                            }
                                            daysOfWeek
                                            repeatBy {
                                                dayOfMonth,
                                                dayOfMonth
                                            }
                                        }
                                    }
                                    locations {
                                        location {
                                            room: {room} { 
                                                number
                                                building: {building} {
                                                    title
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            }],
            'today-sections': [{
                resourceVersions: {
                courses: { min: 16 },
                persons: { min: 12 },
                sectionRegistrations: { min: 16 },
                sections: { min: 16 },
                subjects: { min: 6 }
                },
                'query': `
                    query todaysSections($personId: ID, $yesterday: Date, $tomorrow: Date){
                        sectionRegistrations : {sectionRegistrations}(
                            filter: {
                                {registrant@persons}: {
                                    id: {EQ: $personId}
                                }
                                {section}: {
                                    startOn: {BEFORE: $tomorrow}
                                    endOn: {AFTER: $yesterday}
                                }
                            }
                        ){
                            edges {
                                node {
                                    sections: {section} {
                                        id
                                        course: {course} {
                                            titles {
                                                value
                                            }
                                            number
                                            subject: {subject} {
                                                abbreviation
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            }]
        }
    }]
}
