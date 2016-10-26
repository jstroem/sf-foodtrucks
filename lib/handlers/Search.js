var MethodNotAllowed = require('./MethodNotAllowed');
var BadRequest = require('./BadRequest');
var SFParser = require('./../parsers/SFParser');
var GeoSearcher = require('./../searchers/GeoSearcher');

/**
 * Parses the Query object and its properties `lat_to`, `lon_from`,`lat_from`,`lon_to`.
 * @param  {Object} query The object to parse.
 * @return {[String]}     Returns an array of errors telling what properties was missing or unparsable.
 */
function parseQuery(query) {
  var args = ['lon_to','lon_from','lat_to','lat_from'];
  var errors = [];
  var res = {};
  args.forEach(function(arg) {
    if (query[arg] === undefined || Number.isNaN(query[arg] = Number.parseFloat(query[arg])))
      errors.push(arg);
  });
  return errors;
}

/**
 * Initiates the search handler by setting up the geoSearcher.
 * @param {String} datafile The file to load for the search.
 * @return {Function(Http.IncomingMessage, Http.ServerResponse)}       Returns a request handler function that serves the search results in JSON format.
 */
function InitSearch(datafile) {
  var geoSearcher = new GeoSearcher(SFParser(datafile));

  return function Search(req, res) {
    if (req.method !== 'GET')
      return MethodNotAllowed(req,res);

    var errors = parseQuery(req.url.query);
    if (errors.length)
      return BadRequest(req,res,errors);

    res.writeHeader(200, 'OK', {'Content-Type': 'application/json'});
    res.end(JSON.stringify(geoSearcher.searchArea(req.url.query.lat_from, req.url.query.lat_to, req.url.query.lon_from, req.url.query.lon_to)))
  }
}

module.exports = InitSearch;
