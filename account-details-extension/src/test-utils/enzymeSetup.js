var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');

// polyfill window.crypto for testing nanoid
var nodeCrypto = require('crypto');
global.crypto = {
    // eslint-disable-next-line no-sync
    getRandomValues: function(buffer) { return nodeCrypto.randomFillSync(buffer);}
};

enzyme.configure({ adapter: new Adapter() });