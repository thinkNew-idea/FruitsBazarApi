const NodeCache = require( "node-cache" );
const options = { stdTTL: 100000, checkperiod: 120 }
const cache = new NodeCache();

module.exports = cache
