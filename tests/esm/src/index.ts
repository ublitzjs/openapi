import { extendApp } from "@ublitzjs/core";
import { App, us_listen_socket_close, us_socket_local_port, type us_listen_socket } from "uWebSockets.js";
import { serverExtension as openapiExtension } from "@ublitzjs/openapi";
import process from "node:process";
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
  await server.buildOpenApi(
    import.meta.resolve(
      import.meta.filename, "./openapi.json"
    ),
    true
  )
}
/*!REMOVE*/

export var listenSocket: us_listen_socket;
export var port: number;
export var start = () => {
  server.listen("localhost", 0, (socket) => {
    port = us_socket_local_port(socket);
    listenSocket = socket;
  });
}
export var end = () => us_listen_socket_close(listenSocket);
