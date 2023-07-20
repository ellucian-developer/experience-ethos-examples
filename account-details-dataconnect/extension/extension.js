// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

module.exports = {
    name: 'account-details-dataconnect',
    publisher: 'Ranger',
    cards: [{
        type: 'AccountDetailsDataConnectCard',
        source: './src/cards/AccountDetails.jsx',
        title: 'Account Details - DC',
        displayCardType: 'Account Details - Data Connect',
        description: 'Account Details - Data Connect',
        configuration: {
            client: [{
                key: 'payNowUrl',
                label: 'Pay Now URL',
                type: 'text',
                required: false
            }],
            server: [{
                key: 'ethosApiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: true
            }]
        }
    }],
    page: {
        source: './src/page'
    }
}
