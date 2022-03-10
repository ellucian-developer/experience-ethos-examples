module.exports = {
    name: 'account-details',
    publisher: '',
    cards: [{
        type: 'AccountDetailsCard',
        source: './src/cards/AccountDetails.jsx',
        title: 'Account Details',
        displayCardType: 'Account Details',
        description: 'Account Details',
        configuration: {
            client: [{
                key: 'lambdaUrl',
                label: 'Lambda URL',
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
    }],
    page: {
        source: './src/page'
    }
}
