/**
 * Given an array of data it makes it possible to do simple binary search methods on the data, including range and different indexOf methods.
 * @param {Array} datastore  The array of the data that should be seached.
 * @param {[type]} getValueFunction  A function to retrive the value, from an object in the datastore array, that should be used for the binary search.
 * @param {[type]} comparatorFunction A function to use for the comparison between different values.
 */
function BinarySearcher(datastore, getValueFunction, comparatorFunction) {
  if (typeof getValueFunction != 'function') getValueFunction = function(a) { return a };
  if (typeof comparatorFunction != 'function') comparatorFunction = function(a,b) { return a == b ? 0 : (a < b ? -1 : 1); };

  this._getValueFunction = getValueFunction;
  this._comparatorFunction = comparatorFunction;
  this.datastore = datastore.sort(function(a,b) {
    return comparatorFunction(getValueFunction(a),getValueFunction(b));
  });
}

/**
 * Given a value, it finds a index of an object with that value representation.
 * @param  {mixed} x The value to search for.
 * @return {Number}   returns the index of the object found. If the object wasn't found it returns -1.
 */
BinarySearcher.prototype.indexOf = function(x) {
  var low = 0;
  var high = this.datastore.length - 1;
  while(low <= high) {
    var mid = (low + high) / 2 | 0;
    if (this._comparatorFunction(this._getValueFunction(this.datastore[mid]), x) < 0) // mid < x
      low = mid + 1;
    else if (this._comparatorFunction(x, this._getValueFunction(this.datastore[mid])) < 0) // x < mid
      high = mid - 1;
    else
      return mid;
  }
  return -1;
}

/**
 * Given a value, it finds the first index of the object with that value representation.
 * @param  {mixed} x The value to search for.
 * @return {mixed}  returns the first index of the object found. If the object with the value representation is not to be found the function returns `-point` where `point` is the highest index that could contain the element (This is a string so it can represent -0).
 */
BinarySearcher.prototype._firstIndexOf = function(x) {
  var low = 0;
  var high = this.datastore.length - 1;
  var mid;
  while(low <= high) {
    mid = (low + high) / 2 | 0;
    if (this._comparatorFunction(this._getValueFunction(this.datastore[mid]), x) < 0) // mid < x
      low = mid + 1;
    else if (this._comparatorFunction(x, this._getValueFunction(this.datastore[mid])) < 0) // x < mid
      high = mid - 1;
    else if (mid > 0 && this._comparatorFunction(x, this._getValueFunction(this.datastore[mid - 1])) == 0)
      high = mid - 1;
    else
      return mid;
  }
  return "-" + low;
}

/**
 * Given a value, it finds the first index of the object with that value representation.
 * @param  {mixed} x The value to search for.
 * @return {Number}   returns the first index of the object found. If the object wasn't found it returns -1.
 */
BinarySearcher.prototype.firstIndexOf = function(x) {
  var res = this._firstIndexOf(x);
  return typeof res === "number" ? res : -1;
}

/**
 * Given a value, it finds the last index of the object with that value representation.
 * @param  {mixed} x The value to search for.
 * @return {mixed}  returns the last index of the object found. If the object with the value representation is not to be found the function returns `-point` where `point` is the lowest index that could contain the element (This is a string so it can represent -0).
 */
BinarySearcher.prototype._lastIndexOf = function(x) {
  var low = 0;
  var high = this.datastore.length - 1;
  var mid;
  while(low <= high) {
    mid = (low + high) / 2 | 0;
    if (this._comparatorFunction(this._getValueFunction(this.datastore[mid]), x) < 0) // mid < x
      low = mid + 1;
    else if (this._comparatorFunction(x, this._getValueFunction(this.datastore[mid])) < 0) // x < mid
      high = mid - 1;
    else if (mid < this.datastore.length - 1 && this._comparatorFunction(x, this._getValueFunction(this.datastore[mid + 1])) == 0)
      low = mid + 1;
    else
      return mid;
  }
  return "-" + high;
}

/**
 * Given a value, it finds the last index of the object with that value representation.
 * @param  {mixed} x The value to search for.
 * @return {Number}   returns the last index of the object found. If the object wasn't found it returns -1.
 */
BinarySearcher.prototype.lastIndexOf = function(x) {
  var res = this._lastIndexOf(x);
  return typeof res === "number" ? res : -1;
}

/**
 * Given to values, the method returns a array that contains all elements within that range.
 * @param  {mixed} from The value that is the lowest to search for.
 * @param  {mixed} to  The value that is the highest to search for.
 * @return {Array}     Returns an array of all the object with vlaue representations between the interval.
 */
BinarySearcher.prototype.getRange = function(from, to) {
  var fromIndex = this._firstIndexOf(from);
  var toIndex = this._lastIndexOf(to);
  if (typeof fromIndex === 'string') fromIndex = -fromIndex;
  if (typeof toIndex === 'string') toIndex = -toIndex;

  if (fromIndex > toIndex)
    return [];

  return this.datastore.slice(fromIndex, toIndex+1);
}

module.exports = BinarySearcher;
