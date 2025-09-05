var { extendApp } = require("@ublitzjs/core");
var { App, us_listen_socket_close, us_socket_local_port } = require("uWebSockets.js");
var { serverExtension: openapiExtension } = require("@ublitzjs/openapi");
var path = require("node:path");
var process = require("node:process");
export var server = extendApp(
  App(),
  openapiExtension({
    info: {
      title: "Server",
      version: "1.0.0",
    },
    openapi: "3.0.0",
  })
);
/*REMOVE*/
if(process.env.BUILD_DOCS == "true"){
  server.buildOpenApi(
    path.resolve(
      __dirname, "./openapi.json"
    ),
    true
  )
}
/*!REMOVE*/

export var listenSocket: any;
export var port: number;
export var start = () => {
  server.listen("localhost", 0, (socket: any) => {
    port = us_socket_local_port(socket);
    listenSocket = socket;
  });
}
export var end = () => us_listen_socket_close(listenSocket);
