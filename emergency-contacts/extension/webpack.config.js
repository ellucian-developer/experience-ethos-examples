require('dotenv').config();
const packageJson = require('./package.json');
const extensionConfig = require('./extension.js');
const Dotenv = require('dotenv-webpack');

const { webpackConfigBuilder } = require('@ellucian/experience-extension');

// fill in publisher if missing and defined in dotenv
const { PUBLISHER } = process.env;
if (extensionConfig.publisher === '' && PUBLISHER) {
    extensionConfig.publisher = PUBLISHER;
}

module.exports = async (env, options) => {

    // Generate Webpack configuration based on the extension.js file
    // and any optional env flags  ("--env verbose", "--env upload", etc)
    const webpackConfig = await webpackConfigBuilder({
        extensionConfig: extensionConfig,
        extensionVersion: packageJson.version,
        mode: options.mode || 'production',
        verbose: env.verbose || process.env.EXPERIENCE_EXTENSION_VERBOSE || false,
        upload: env.upload || process.env.EXPERIENCE_EXTENSION_UPLOAD || false,
        forceUpload: env.forceUpload || process.env.EXPERIENCE_EXTENSION_FORCE_UPLOAD || false,
        uploadToken: process.env.EXPERIENCE_EXTENSION_UPLOAD_TOKEN,
        liveReload: env.liveReload || false,
        port: process.env.PORT || 8082
    });

    // For advanced scenarios, dynamically modify webpackConfig here.
    webpackConfig.plugins.push(new Dotenv());

    webpackConfig.output.filename = `[name]-${Date.now()}.js`;

    return webpackConfig;
};