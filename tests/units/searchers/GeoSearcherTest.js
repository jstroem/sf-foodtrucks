var GeoSearcher = require('../../../lib/searchers/GeoSearcher');

describe('GeoSearcher', function(){

  var obj1 = {'latitude': 30, 'longitude': 40, id: 1},
      obj2 = {'latitude': 31, 'longitude': 41, id: 2},
      obj3 = {'latitude': 32, 'longitude': 42, id: 3},
      obj4 = {'latitude': 30, 'longitude': 41, id: 4},
      obj5 = {'latitude': 31, 'longitude': 40, id: 5};

  describe('.searchArea', function(){
    it('Should include the bounds', function() {
      var geoSearcher = new GeoSearcher([obj1,obj2,obj3,obj4,obj5]);
      expect(geoSearcher.searchArea(0,30,0,40)).toEqual([obj1]);
      expect(geoSearcher.searchArea(30,31,40,41)).toEqual([obj1,obj4,obj2,obj5]);
      expect(geoSearcher.searchArea(30,30,41,41)).toEqual([obj4]);
    });

    it('Should give you all elements within that area', function() {
      var geoSearcher = new GeoSearcher([obj1,obj2,obj3,obj4,obj5]);
      expect(geoSearcher.searchArea(0,29,0,39)).toEqual([]);
      expect(geoSearcher.searchArea(0,100,0,100)).toEqual([obj1,obj4,obj2,obj5,obj3]);
      expect(geoSearcher.searchArea(30,100,40,100)).toEqual([obj1,obj4,obj2,obj5,obj3]);
      expect(geoSearcher.searchArea(32,100,40,100)).toEqual([obj3]);
      expect(geoSearcher.searchArea(31,100,40,41)).toEqual([obj2,obj5]);
    });
  });
});
