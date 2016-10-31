var path = require('path');
var fs = require('fs');
var NotFound = require('./NotFound');
var mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css"
};

/**
 * Parses the filepath relative to the basepath and ensures that the filepath is not jumping outside of the basepath. If the filepath is pointing at a directory append 'index.html'.
 * @param  {String} basepath basepath.
 * @param  {String} filepath filepath.
 * @return {String}          Returns the filepath within the basepath. If the filepath goes outside of basepath it returns null.
 */
function parsePath(basepath, filepath) {
  if (filepath.substr(-1) === '/')
    filepath += 'index.html';

  filepath = path.normalize(path.join(basepath, filepath));

  //Ensure that the filepath that is trying to accessed is witin basepath.
  if (!filepath.startsWith(basepath))
    return null;
  else
    return filepath;
}

/**
 * Sets up a static content request handler given a basepath it serves all files within that area.
 * @param {String} basepath The basepath to serve the static content from.
 * @param {Number} cacheTime The max-age value for the static content server.
 * @returns {Function(Http.IncomingMessage, Http.ServerResponse)}   Returns a request handler function that serves the files within basepath.
 */
function InitStaticContent(basepath,cacheTime) {
  if (cacheTime === undefined || typeof cacheTime !== "number")
    cacheTime = 3600;

  basepath = path.normalize(basepath);
  return function StaticContentHandler(req, res){
    var filename = parsePath(basepath, req.url.pathname);

    //If the url.pathname goes outside of basepath return NotFound.
    if (!filename)
      return NotFound(req, res);

    //Check if the file exists
    fs.exists(filename, function(exists) {
      if (!exists)
        return NotFound(req,res);

      //If the mimeType is not found in the map, invalid file is trying to be accessed.
      var mimeType = mimeTypes[path.extname(filename)];
      if (!mimeType)
        return NotFound(req,res);

      //Stream the file.
      res.writeHead(200, 'OK', {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=' + cacheTime
      });
      var fileStream = fs.createReadStream(filename);
      fileStream.pipe(res);
    });
  }
}

module.exports = InitStaticContent;
