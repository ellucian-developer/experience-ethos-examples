// Copyright 2021-2025 Ellucian Company L.P. and its affiliates.

module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react'
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/transform-runtime'
    ],
    env: {
        test: {
            plugins: [
                'rewire'
            ]
        }
    }
}