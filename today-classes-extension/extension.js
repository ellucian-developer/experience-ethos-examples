module.exports = {
  name: 'Today\'s Classes',
  publisher: 'Ellucian',
  cards: [{
    type: 'TodayClassesGraphQLProxy',
    source: './src/graphql-proxy/cards/TodayClasses',
    title: 'Today\'s Classes - GraphQL Proxy',
    displayCardType: 'Today\'s Classes - GraphQL Proxy',
    description: 'Today\'s Classes via GraphQL Proxy',
    queries: {
      // Note at this time there is a bug which requires the queries which use the
      // personId filter to be defined after queries which do not
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
    }, {
        type: 'TodayClassesLambda',
        source: './src/lambda/cards/TodayClasses',
        title: 'Today\'s Classes - Lambda',
        displayCardType: 'Today\'s Classes - Lambda',
        description: 'Today\'s Classes via Lambda',
        configuration: {
            client: [{
                key: 'lambdaUrl',
                label: 'Lambda Today Classes URL',
                type: 'string',
                required: true
            }],
            server: [{
                key: 'apiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: false
            }]
        }
    }, {
        type: 'TodayClassesNode',
        source: './src/node/cards/TodayClasses',
        title: 'Today\'s Classes - Node',
        displayCardType: 'Today\'s Classes - Node',
        description: 'Today\'s Classes via Node',
        configuration: {
            client: [{
                key: 'nodeUrl',
                label: 'Node Today Classes URL',
                type: 'string',
                required: true
            }],
            server: [{
                key: 'apiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: false
            }]
        }
    }, {
        type: 'TodayClassesDash',
        source: './src/cards/TodayClassesDash',
        title: 'Today\'s Classes - Dash',
        displayCardType: 'Today\'s Classes - Dash',
        description: 'Today\'s Classes Dash'
    }
  ]
}