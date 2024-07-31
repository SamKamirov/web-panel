const { readFileSync } = require("fs");
const http = require("http");
const url = require("url");
const ip = require("ip");
const fs = require("fs");

const INDEX = "./index.html";
const SEVEN = "./7/7.html";
const MONTH = "./30/30.html";
const PORT = 3000;

let serverAddress = ip.address();

const replaceAddress = (filename) => {
  fs.readFile(filename, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result;

    result = data.replace(/server/g, `http://${serverAddress}:${PORT}`);

    fs.writeFile(filename, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
};

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

replaceAddress(INDEX);
replaceAddress(SEVEN);
replaceAddress(MONTH);

server.listen(PORT, serverAddress);
console.log("Server started on " + serverAddress + ":3000");
