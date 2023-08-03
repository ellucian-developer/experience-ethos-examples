// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

module.exports = {
    name: 'instructor-classes-lambda',
    publisher: '',
    cards: [{
        type: 'InstructorClassesLambda',
        source: './src/cards/InstructorClasses',
        title: 'Instructor\'s Classes - Lambda',
        displayCardType: 'Instructor\'s Classes Lambda',
        description: 'Instructor\'s Classes via Lambda',
        configuration: {
            client: [{
                key: 'serviceUrl',
                label: 'Service URL',
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
    }
  ]
}
