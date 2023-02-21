module.exports = {
    name: 'Today\'s Classes - Node',
    publisher: '',
    cards: [{
        type: 'TodayClassesNode',
        source: './src/cards/TodayClasses.jsx',
        title: 'Today\'s Classes - Node',
        displayCardType: 'TodayClassesNode',
        description: 'Today Classes - Node',
        configuration: {
            client: [{
                key: 'microserviceUrl',
                label: 'Today Classes Microservice URL',
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
