// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

module.exports = {
    name: 'emergency-contacts',
    publisher: process.env.PUBLISHER,
    cards: [{
        type: 'EmergencyContactsCard',
        source: './src/cards/EmergencyContacts.jsx',
        title: 'Emergency Contacts',
        displayCardType: 'Emergency Contacts',
        description: 'Emergency Contacts',
        configuration: {
            server: [{
                key: 'ethosApiKey',
                label: 'Ethos API Key',
                type: 'password',
                require: true
            }]
        }
    }]
}
