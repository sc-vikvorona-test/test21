const { sharedHelper } = require('./shared-helper');
function feature(input) { return sharedHelper(input).toUpperCase(); }
module.exports = { feature };
