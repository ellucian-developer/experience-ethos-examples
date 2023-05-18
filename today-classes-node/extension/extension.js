module.exports = {
    name: 'today-classes-node',
    publisher: '',
    cards: [{
        type: 'TodayClassesNode',
        source: './src/cards/TodayClasses.jsx',
        title: 'Today\'s Classes - Node',
        displayCardType: 'Today Classes Node',
        description: 'Today Classes - Node',
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
