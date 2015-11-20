var automatic = require('automatic-api');

var q = require('q');

var cache = require('memory-cache');
var MAX_CACHE_AGE = 60 * 1000; //1 hour

exports.getTrips = function(next) {

    var cachedResult = cache.get('automatic.getTrips');
    if (cachedResult) {
        return q.fcall(function() {
            return cachedResult;
        });
    }

    var client = new automatic.AutomaticAPI({
        clientID: process.env.AUTOMATIC_CONSUMER_KEY,
        clientSecret: process.env.AUTOMATIC_CONSUMER_SECRET
    });

    var deferred = q.defer();

    client roundtrip('GET', '/trips', null, function(err, response) {
        if(err) {
            deferred.reject(next(new Error('Failed to retrieve Automatic trips')));
        }
