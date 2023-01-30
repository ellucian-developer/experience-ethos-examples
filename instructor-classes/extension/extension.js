// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

module.exports = {
    name: 'Instructor\'s Classes',
    publisher: '',
    cards: [{
        type: 'InstructorClassesLambda',
        source: './src/cards/InstructorClasses',
        title: 'Instructor\'s Classes - Lambda',
        displayCardType: 'Instructor\'s Classes',
        description: 'Instructor\'s Classes',
        configuration: {
            client: [{
                key: 'lambdaUrl',
                label: 'Instructor Classes URL',
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