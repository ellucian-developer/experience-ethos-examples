export const todaysSections = `
query todaysSections($personId: ID, $yesterday: Date, $tomorrow: Date){
    sectionRegistrations : sectionRegistrations16(
        filter: {
            registrant12: {
                id: {EQ: $personId}
            }
            section16: {
            startOn: {BEFORE: $tomorrow}
            endOn: {AFTER: $yesterday}
            }
        }
    ){
        edges {
            node {
                sections: section16 {
                  id
                  course: course16 {
                    titles {
                      value
                    }
                    number
                    subject: subject6 {
                      abbreviation
                    }
                  }
                }
            }
        }
    }
}
`

export const instructionalEventsBySection = `
query instructionalEventsBySection($sectionId: ID){
    instructionalEvents : instructionalEvents8(
      filter: {
        section16: {
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
              room: room10 { 
                number
                building: building6 {
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
