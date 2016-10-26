var fs = require('fs');

/**
 * Given the sheet it returns a array of objects representing each column by name and field type.
 * @param  {Object} sheet The parsed JSON data sheet.
 * @return {[{name: '...', type: '...'}]}      Array with a object for each column, with the same ordering.
 */
function getColumns(sheet){
  var columns = sheet['meta'] && sheet['meta']['view'] && sheet['meta']['view']['columns'] || [];
  var res = [];
  for(var i = 0; i < columns.length; i++)
    res.push({
      name: columns[i]["fieldName"],
      type: columns[i]["dataTypeName"]
    });
  return res;
}

/**
 * Given a data type and the data it parses the data accordingly.
 * @param  {mixed} data The data to be parsed.
 * @param  {String} type The type to parse the data into.
 * @return {mixed}      A parsed representation of the data according to the type.
 */
function parseDataType(data, type) {
  if (data == null || data == undefined)
    return null;

  switch(type) {
    case 'meta_data':
    case 'location':
    case 'text':
      return data;

    case 'calendar_date':
      return new Date(data);

    case 'number':
      return Number.parseFloat(data);
  }
}

/**
 * Transforms the property of the food truck object.
 * @param  {Object} obj The object representing the Food truck before transformation.
 * @return {Object}     The object for the food truck after transformation.
 */
function transformObject(obj) {
  if (typeof obj['fooditems'] === 'string') {
    obj['fooditems'] = obj['fooditems'].split(':').map(function(item) { return item.trim(); });
    obj['foodtypes'] = GenerateFoodTypes(obj['fooditems']);
  } else {
    obj['fooditems'] = [];
    obj['foodtypes'] = [];
  }
  if (obj[':id']) {
    obj['id'] = obj[':id'];
    delete obj[':id'];
  }
  return obj;
}

/**
 * Keywords to generate food types, key is a String represenation of a RegExp and the value is the foodtype to map into.
 * @type {Object}
 */
var foodTypeKeywords = {
  'sandwich': 'Sandwiches',
  'donut': 'Donuts',
  'soda': 'Cold drinks',
  'tea': 'Warm drinks',
  'hot dog': 'Hot dogs',
  'hotdog': 'Hot dogs',
  'pasta': 'Pasta',
  'beef': 'Beef',
  'pork': 'Pork',
  'lamb': 'Lamb',
  'rice': 'Rice diches',
  'chicken': 'Chicken',
  'salad': 'Salad',
  'candy': 'Candy',
  'fruit': 'Fruit',
  'pita': 'Pita',
  'brownie': 'Cake',
  'muffin': 'Cake',
  'beverage': 'Cold drinks',
  'ice.*cream': 'Ice cream',
  'snack': 'Snacks',
  'cold.*drink': 'Cold drinks',
  'cold.*truck': 'Cold drinks',
  'warm.*drink': 'Warm drinks',
  'hot.*drink': 'Warm drinks',
  'coffee': 'Warm drinks',
  'taco': 'Tacos',
  'burrito': 'Burritos',
  'burger': 'Burgers'
}

/**
 * Given a list of food items we generate the foodtypes available on that given truck.
 * @param {[String]} fooditems A list of the food items.
 */
function GenerateFoodTypes(fooditems) {
  var foodtypes = new Set();
  fooditems.forEach(function(fooditem) {
    for(var keyword in foodTypeKeywords) {
      var regexp = new RegExp(keyword, "i");
      if (fooditem.search(regexp) > -1) {
        foodtypes.add(foodTypeKeywords[keyword]);
      }
    }
  });
  return Array.from(foodtypes.values());
}

/**
 * Runs through the datasheet and converts each row of data into a object according to the columns and field type.
 * @param  {Object} sheet The parsed JSON data sheet.
 * @return {[Object]} An array of the objects from the sheet.
 */
function parseData(sheet) {
  var columns = getColumns(sheet);
  var res = [];
  var rows = sheet['data'] || [];
  return rows.map(function(row) {
    var obj = {};
    for (var col = 0; col < row.length; col++) {
      obj[columns[col]['name']] = parseDataType(row[col], columns[col]['type']);
    }
    return transformObject(obj);
  });
}

/**
 * Runs thorugh the data and removes all the objects that isn't active.
 * @param  {[Object]} An array of the pared objects.
 * @return {[Object]} The same array with duplicates removed.
 */
function filterData(data) {
  var now = new Date();
  return data.filter(function filter(obj) {
    return obj.status == 'APPROVED' && obj.expirationdate >= now;
  });
}

/**
 * Given a filepath it loads the datastore.
 * @param  {String} filepath Path to the file to load.
 * @return {[Object]}        Returns a array of objects representating the datastore.
 */
function parse(filepath) {
  var sheet = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  var data = parseData(sheet);
  return filterData(data);
}

module.exports = parse;
