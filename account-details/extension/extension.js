// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

module.exports = {
    name: 'account-details',
    publisher: 'Ranger',
    cards: [{
        type: 'AccountDetailsCard',
        source: './src/cards/AccountDetails.jsx',
        title: 'Account Details',
        displayCardType: 'Account Details',
        description: 'Account Details',
        configuration: {
            client: [{
                key: 'serviceUrl',
                label: 'Service URL',
                type: 'text',
                required: true
            },
            {
                key: 'payNowUrl',
                label: 'Pay Now URL',
                type: 'text',
                required: false
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
