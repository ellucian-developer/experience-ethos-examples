// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

export const instructorsSections = `
query sectionsByInstructor($instructorId: ID) {
	sectionInstructors: sectionInstructors10(
		filter: {
			instructor12: { id: { EQ: $instructorId } }
		}
	) {
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
`;

export const instructionalEventsBySectionV8 = `
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
`;

export const instructionalEventsBySectionV11 = `
query instructionalEventsBySection($sectionId: ID){
    instructionalEvents : instructionalEvents11(
      filter: {
        section16: {
          id: {EQ: $sectionId}
        }
      }
    ){
      edges {
        node {
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
                building: building11 {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;
