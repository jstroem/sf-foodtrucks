/**
 * NotFound request handler.
 * @param {Http.IncomingMessage} req request
 * @param {Http.ServerResponse} res resposne
 */
function NotFound(req, res) {
  console.log("Not found: %s", req.url.pathname);
  res.writeHead(404, 'Not found', {'Content-Type': 'text/plain'});
  res.end("Not found");
}
module.exports = NotFound;
