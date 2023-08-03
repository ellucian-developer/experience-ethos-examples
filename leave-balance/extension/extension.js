module.exports = {
    name: 'leave-balance',
    group: 'Ellucian Experience',
    publisher: '',
    cards: [{
        type: 'LeaveBalanceCard',
        source: './src/cards/LeaveBalance.jsx',
        title: 'Leave Balance',
        displayCardType: 'Leave Balance',
        description: 'Leave Balance',
        configuration: {
            client: [{
                key: 'serviceUrl',
                label: 'Service URL',
                type: 'text',
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
