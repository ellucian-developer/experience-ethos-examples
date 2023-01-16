module.exports = {
    name: 'leave-balance',
    publisher: '',
    cards: [{
        type: 'LeaveBalanceCard',
        source: './src/cards/LeaveBalance.jsx',
        title: 'Leave Balance',
        displayCardType: 'LeaveBalance',
        description: 'Leave Balance',
        configuration: {
            client: [{
                key: 'lambdaUrl',
                label: 'Lambda URL',
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
