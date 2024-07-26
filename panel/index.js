const { readFileSync } = require("fs");
const http = require("http");
const url = require("url");

let server = new http.Server((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "access-control-allow-origin": "*",
  });

  const reqUrl = url.parse(req.url).pathname;

  const MONTH = readFileSync("./formatted 30.json");
  const SEVEN = readFileSync("./formatted 7.json");
  const DATE_CONFIG = readFileSync("./config.json");

  if (reqUrl === "/7") {
    res.end(SEVEN);
  }

  if (reqUrl === "/30") {
    res.end(MONTH);
  }

  if (reqUrl === "/") {
    res.end(DATE_CONFIG);
  }
});

server.listen(3000, "localhost");
