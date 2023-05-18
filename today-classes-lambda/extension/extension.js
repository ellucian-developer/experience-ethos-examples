module.exports = {
    name: 'today-classes-lambda',
    publisher: '',
    cards: [{
        type: 'TodayClassesLambda',
        source: './src/cards/TodayClasses',
        title: 'Today\'s Classes - Lambda',
        displayCardType: 'Today\'s Classes - Lambda',
        description: 'Today\'s Classes via Lambda',
            configuration: {
            client: [{
                key: 'serviceUrl',
                label: 'Service URL',
                type: 'string',
                required: true
            }],
            server: [{
                key: 'ethosApiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: false
            }]
        }
    }]
}
