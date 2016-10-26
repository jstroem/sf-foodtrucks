var BinarySearcher = require('./BinarySearcher');

/**
 * Given a object returns it's latitude.
 * @param  {Object} obj With a latitude property.
 * @return {mixed}     The `latitude` property on the object.
 */
function getLatitude(obj) {
  return obj.latitude;
}

/**
 * Longitude filter predicate.
 * @param  {Number} from The smallest longitude that should be accepted from the filter.
 * @param  {Number} to   The largest longitude that should be accepted from the filter.
 * @return {Boolean}     Whether the object had an `longitude` property in the range [from; to].
 */
function longitudeFilter(from,to) {
  return function(obj) {
    return from <= obj.longitude && obj.longitude <= to;
  }
}

/**
 * GeoSearcher that makes it possible to search a datastore filled with locations.
 * @param {[Object]} datastore Array of objects that have the properties `longitude`and `latitude`.
 */
function GeoSearcher(datastore) {
  this._latitudeBinarySearcher = new BinarySearcher(datastore, getLatitude);
}

/**
 * Main method to search the datastore by setting ranges on both latitude and longitude.
 * @param  {Number} from_lat The lower bound on the latitude
 * @param  {Number} to_lat   The upper bound on the latitude
 * @param  {Number} from_lon The lower bound on the longitude
 * @param  {Number} to_lon   The upper boudn on the longitude
 * @return {[Object]}        An array of the objects from the datastore satisfying their `longitude` property is in the range [from_lon;to_lon] and the `latitude` property is in the range [from_lat,to_lat]
 */
GeoSearcher.prototype.searchArea = function(from_lat,to_lat,from_lon,to_lon) {
  var range = this._latitudeBinarySearcher.getRange(from_lat, to_lat);
  return range.filter(longitudeFilter(from_lon, to_lon));
}

module.exports = GeoSearcher;
