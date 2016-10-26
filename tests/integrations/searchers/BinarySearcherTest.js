var BinarySearcher = require('../../../lib/searchers/binarySearcher');
const NumberOfTestsArrays = 100;
const MinLengthOfTestArrays = 100;
const MaxLengthOfTestArrays = 200;

describe('BinarySearcher', function(){

  function randomFloat(low, high) {
    return Math.random() * (high - low) + low;
  }

  function randomInt(low, high) {
    return Math.floor(randomFloat(low, high));
  }

  function generateArray(length, generator) {
    var res = [];
    while(res.length < length)
      res.push(generator());
    return res;
  }

  function generateArrays(number_of_arrays, min_length, max_length, generator) {
    var res = [];
    while(res.length < number_of_arrays)
      res.push(generateArray(randomInt(min_length,max_length), generator));
    return res;
  }

  var integerArrays = generateArrays(NumberOfTestsArrays, MinLengthOfTestArrays, MaxLengthOfTestArrays, function(){ return randomInt(-100, 100); });
  var floatArrays = generateArrays(NumberOfTestsArrays, MinLengthOfTestArrays, MaxLengthOfTestArrays, function(){ return randomFloat(-100, 100); });

  it('Should be able to find lastIndex and firstIndex with integers', function() {
    for(var i = 0; i < integerArrays.length; i++) {
      var binarySearch = new BinarySearcher(integerArrays[i]);
      var store = binarySearch.datastore;
      store.forEach(function(num) {
        expect(store.indexOf(num)).toEqual(binarySearch.firstIndexOf(num));
        expect(store.lastIndexOf(num)).toEqual(binarySearch.lastIndexOf(num));
      });
    }
  });

  it('Should be able to find lastIndex and firstIndex with floats', function() {
    for(var i = 0; i < floatArrays.length; i++) {
      var binarySearch = new BinarySearcher(floatArrays[i]);
      var store = binarySearch.datastore;
      store.forEach(function(num) {
        expect(store.indexOf(num)).toEqual(binarySearch.firstIndexOf(num));
        expect(store.lastIndexOf(num)).toEqual(binarySearch.lastIndexOf(num));
      });
    }
  });

  it('Should be able to get ranges for integer', function() {
    for(var i = 0; i < integerArrays.length; i++) {
      var binarySearch = new BinarySearcher(integerArrays[i]);
      var store = binarySearch.datastore;

      for(var j = 0; j < store.length; j++) {
        var lastSmallIndex = null;
        var lastLargeIndex = null;
        for(var k = j+1; k < store.length; k++) {
          var smallIndex = store.indexOf(store[j]);
          var largeIndex = store.lastIndexOf(store[k]);
          if (smallIndex == lastSmallIndex && largeIndex == lastLargeIndex)
            continue;
          lastSmallIndex = smallIndex;
          lastLargeIndex = largeIndex;

          expect(store.slice(lastSmallIndex, lastLargeIndex+1)).toEqual(binarySearch.getRange(store[j], store[k]));
        }
      }
    }
  })

  it('Should be able to get ranges for floats', function() {
    for(var i = 0; i < floatArrays.length; i++) {
      var binarySearch = new BinarySearcher(floatArrays[i]);
      var store = binarySearch.datastore;

      for(var j = 0; j < store.length; j++) {
        var lastSmallIndex = null;
        var lastLargeIndex = null;
        for(var k = j+1; k < store.length; k++) {
          var smallIndex = store.indexOf(store[j]);
          var largeIndex = store.lastIndexOf(store[k]);
          if (smallIndex == lastSmallIndex && largeIndex == lastLargeIndex)
            continue;
          lastSmallIndex = smallIndex;
          lastLargeIndex = largeIndex;

          expect(store.slice(lastSmallIndex, lastLargeIndex+1)).toEqual(binarySearch.getRange(store[j], store[k]));
        }
      }
    }
  })



})
