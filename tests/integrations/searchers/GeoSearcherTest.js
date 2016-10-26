var GeoSearcher = require('../../../lib/searchers/GeoSearcher');
var SFParser = require('../../../lib/parsers/SFParser');

const DataFile = __dirname + '/../../../data/sf_datasheet.json';
const NumberOfTests = 1000;

describe('GeoSearcher', function(){
  var data = SFParser(DataFile);
  var geoSearcher = new GeoSearcher(data);

  function randomFloat(low, high) {
    return Math.random() * (high - low) + low;
  }

  function randomInt(low, high) {
    return Math.floor(randomFloat(low, high));
  }

  function bfSearcher(from_lat,to_lat,from_lon,to_lon) {
    var res = [];
    data.forEach(function(obj) {
      if (from_lat <= obj.latitude && obj.latitude <= to_lat && from_lon <= obj.longitude && obj.longitude <= to_lon)
        res.push(obj);
    });
    return res;
  }

  function sortById(a,b) {
    return a[':id'] < b[':id'] ? -1 : 1;
  }

  it('Should give the same result as the brute force solution', function() {
    var performedTests = 0;
    while(performedTests < NumberOfTests) {
      var obj1 = data[randomInt(0,data.length - 1)];
      var obj2 = data[randomInt(0,data.length - 1)];
      if (obj1 === obj2)
        continue;

      var from_lat = Math.min(obj1.latitude, obj2.latitude);
      var to_lat = Math.max(obj1.latitude, obj2.latitude);
      var from_lon = Math.min(obj1.longitude, obj2.longitude);
      var to_lon = Math.max(obj1.longitude, obj2.longitude);

      var geoSearchResult = geoSearcher.searchArea(from_lat, to_lat, from_lon, to_lon).sort(sortById);
      var bfSearchResult = bfSearcher(from_lat, to_lat, from_lon, to_lon).sort(sortById);

      expect(geoSearchResult).toEqual(bfSearchResult);
      performedTests++;
    }

  });

});
