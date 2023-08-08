module.exports = {
    name: 'leave-balance-dataconnect',
    publisher: '',
    cards: [{
        type: 'LeaveBalanceDataConnectCard',
        source: './src/cards/LeaveBalance.jsx',
        title: 'Leave Balance - DC',
        displayCardType: 'Leave Balance - Data Connect',
        description: 'Leave Balance - Data Connect',
        configuration: {
            client: [{
                key: 'pipelineApi',
                label: 'Pipeline API',
                type: 'text',
                required: true
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
