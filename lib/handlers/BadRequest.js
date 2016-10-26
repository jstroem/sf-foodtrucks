/**
 * MethodNotAllowed request handler
 * @param {Http.IncomingMessage} req request
 * @param {Http.ServerResponse} res response
 * @param {Array} errors The list of arguments that was invalied.
 */
function BadRequest(req, res, errors) {
  console.log("Bad request, for the following params", errors);
  res.writeHead(400, 'Bad Request', {'Content-Type': 'text/plain'});
  res.end("Bad request, missed the following parameters: " + errors);
}
module.exports = BadRequest;
