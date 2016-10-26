var BinarySearcher = require('../../../lib/searchers/binarySearcher');

describe('BinarySearcher', function(){

  describe('.indexOf', function(){
    it('should return the index of an element given otherwise -1', function(){
      var arr = [1,2,3,5,7];
      var binarySearch = new BinarySearcher(arr);
      expect(binarySearch.indexOf(0)).toBe(-1);
      expect(binarySearch.indexOf(3)).toBe(2);
      expect(binarySearch.indexOf(4)).toBe(-1);
      expect(binarySearch.indexOf(1)).toBe(0);
      expect(binarySearch.indexOf(7)).toBe(4);
    });
  });

  describe('.firstIndexOf', function() {
    it('should return the index of an element given otherwise -1', function() {
       var arr = [1,2,3,5,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch.firstIndexOf(0)).toBe(-1);
       expect(binarySearch.firstIndexOf(8)).toBe(-1);
       expect(binarySearch.firstIndexOf(3)).toBe(2);
       expect(binarySearch.firstIndexOf(4)).toBe(-1);
       expect(binarySearch.firstIndexOf(1)).toBe(0);
       expect(binarySearch.firstIndexOf(7)).toBe(4);
    });

    it('should return the first index of the element', function() {
       var arr = [1,2,2,2,2,2,3,5,7,7,7,7,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch.firstIndexOf(2)).toBe(1);
       expect(binarySearch.firstIndexOf(7)).toBe(8);
    });
  })

  describe('._firstIndexOf', function() {
    it('should return the first index of an element given', function() {
       var arr = [1,2,3,5,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch._lastIndexOf(3)).toBe(2);
       expect(binarySearch._lastIndexOf(1)).toBe(0);
       expect(binarySearch._lastIndexOf(7)).toBe(4);
    });

    it('should return the first index of the element', function() {
       var arr = [1,2,2,2,2,2,3,5,7,7,7,7,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch._firstIndexOf(2)).toBe(1);
       expect(binarySearch._firstIndexOf(7)).toBe(8);
    });

    it('should return -lastPosition the element could have been.', function() {
       var arr = [1,2,2,2,2,2,3,5,7,7,7,7,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch._firstIndexOf(0)).toBe("-0");
       expect(binarySearch._firstIndexOf(8)).toBe("-13");
       expect(binarySearch._firstIndexOf(4)).toBe("-7");
       expect(binarySearch._firstIndexOf(6)).toBe("-8");
       expect(binarySearch._firstIndexOf(5.5)).toBe("-8");
       expect(binarySearch._firstIndexOf(4.5)).toBe("-7");
    });
  });

  describe('.lastIndexOf', function() {
    it('should return the last index of an element given otherwise -1', function() {
       var arr = [1,2,3,5,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch.lastIndexOf(0)).toBe(-1);
       expect(binarySearch.lastIndexOf(3)).toBe(2);
       expect(binarySearch.lastIndexOf(4)).toBe(-1);
       expect(binarySearch.lastIndexOf(1)).toBe(0);
       expect(binarySearch.lastIndexOf(7)).toBe(4);
    });

    it('should return the last index of the element', function() {
       var arr = [1,2,2,2,2,2,3,5,7,7,7,7,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch.lastIndexOf(2)).toBe(5);
       expect(binarySearch.lastIndexOf(7)).toBe(12);
    });
  });

  describe('._lastIndexOf', function() {
    it('should return the last index of an element given', function() {
       var arr = [1,2,3,5,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch._lastIndexOf(3)).toBe(2);
       expect(binarySearch._lastIndexOf(1)).toBe(0);
       expect(binarySearch._lastIndexOf(7)).toBe(4);
    });

    it('should return the last index of the element', function() {
       var arr = [1,2,2,2,2,2,3,5,7,7,7,7,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch._lastIndexOf(2)).toBe(5);
       expect(binarySearch._lastIndexOf(7)).toBe(12);
    });

    it('should return -lastPosition the element could have been.', function() {
       var arr = [1,2,2,2,2,2,3,5,7,7,7,7,7];
       var binarySearch = new BinarySearcher(arr);
       expect(binarySearch._lastIndexOf(0)).toBe("--1");
       expect(binarySearch._lastIndexOf(8)).toBe("-12");
       expect(binarySearch._lastIndexOf(4)).toBe("-6");
       expect(binarySearch._lastIndexOf(6)).toBe("-7");
       expect(binarySearch._lastIndexOf(1.1)).toBe("-0");
       expect(binarySearch._lastIndexOf(0.1)).toBe("--1");
    });
  });

  describe('.getRange', function(){
    it('should return the range of elements inbetween to numbers', function() {
      var arr = [1,2,3,4,5,6,7,10,12];
      var binarySearch = new BinarySearcher(arr);
      expect(binarySearch.getRange(0,13)).toEqual(arr);
      expect(binarySearch.getRange(1,12)).toEqual(arr);
      expect(binarySearch.getRange(2,10)).toEqual([2,3,4,5,6,7,10]);
      expect(binarySearch.getRange(2,7)).toEqual([2,3,4,5,6,7]);
      expect(binarySearch.getRange(2.001,7)).toEqual([3,4,5,6,7]);
    });

    it('should return the complete range inclusive duplicates', function() {
      var arr = [1,1.9,1.99999,2,2,2,2,2,2,2,2.099,3,4,5,6,7,10,10.5,10.7,10.9999,12];
      var binarySearch = new BinarySearcher(arr);
      expect(binarySearch.getRange(0,13)).toEqual(arr);
      expect(binarySearch.getRange(1,12)).toEqual(arr);
      expect(binarySearch.getRange(2,10)).toEqual([2,2,2,2,2,2,2,2.099,3,4,5,6,7,10]);
      expect(binarySearch.getRange(1.9,3)).toEqual([1.9,1.99999,2,2,2,2,2,2,2,2.099,3]);
      expect(binarySearch.getRange(2,2)).toEqual([2,2,2,2,2,2,2]);
      expect(binarySearch.getRange(2,2.1)).toEqual([2,2,2,2,2,2,2,2.099]);
      expect(binarySearch.getRange(10.9999,10.9999)).toEqual([10.9999]);
      expect(binarySearch.getRange(10.99991,10.99999)).toEqual([]);
      expect(binarySearch.getRange(10.71,10.998)).toEqual([]);
    });
  });

});
