var { extendApp } = require("@ublitzjs/core");
var { App, us_listen_socket_close, us_socket_local_port } = require("uWebSockets.js");
var { serverExtension: openapiExtension } = require("@ublitzjs/openapi");
var path = require("node:path");
var process = require("node:process");
var server = extendApp(
  App(),
  openapiExtension({
    info: {
      title: "Server",
      version: "1.0.0",
    },
    openapi: "3.0.0",
  })
);
var openapiJsonPath = path.resolve(
      __dirname, "../openapi.json"
);
/*REMOVE*/
if(process.env.BUILD_DOCS == "true"){
  server.buildOpenApi(
    openapiJsonPath,
    true
  )
}
/*!REMOVE*/
var listenSocket: any;
var port: number;
var start = async () => {
    await server.serveOpenApi("/docs", {clearMimes: true, path: openapiJsonPath, uiPath: "ui"})
  server.listen("localhost", 0, (socket: any) => {
    module.exports.port = port = us_socket_local_port(socket);
    listenSocket = socket;
  });
}
var end = () => us_listen_socket_close(listenSocket);

module.exports = {
  listenSocket,
  start,
  end
}
