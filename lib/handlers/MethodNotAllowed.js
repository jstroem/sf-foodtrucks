/**
 * MethodNotAllowed request handler
 * @param {Http.IncomingMessage} req request
 * @param {Http.ServerResponse} res response
 */
function MethodNotAllowed(req, res) {
  console.log("Method not allowed: %s", req.method)
  res.writeHead(405, 'Method Not Allowed', {'Content-Type': 'text/plain'});
  res.end("Method not allowed");
}
module.exports = MethodNotAllowed;
