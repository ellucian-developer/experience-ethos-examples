// Copyright 2021-2022 Ellucian Company L.P. and its affiliates.

module.exports = {
  name: 'Instructor\'s Classes',
  publisher: 'Ranger',
  cards: [{
        type: 'InstructorClassesLambda',
        source: './src/cards/InstructorClasses',
        title: 'Instructor\'s Classes - Lambda',
        displayCardType: 'Instructor\'s Classes - Lambda',
        description: 'Instructor\'s Classes via Lambda',
        configuration: {
            client: [{
                key: 'lambdaUrl',
                label: 'Lambda Instructor Classes URL',
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