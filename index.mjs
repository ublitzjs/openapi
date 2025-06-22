import { OpenApiBuilder } from "openapi3-ts/oas31";
import {
  DeclarativeResponse,
  registerAbort,
  seeOtherMethods,
} from "@ublitzjs/core";
import {
  analyzeFolder,
  basicSendFile,
  sendFile,
  staticServe,
} from "@ublitzjs/static";
import { exit } from "node:process";
import { createWriteStream, write } from "node:fs";
import path from "node:path";
var serverExtension = (opts) => ({
  openApiBuilder: new OpenApiBuilder(opts),
  async serveOpenApi(prefix, opts) {
    var specController;
    if (opts) {
      var length;
      if (opts.build) length = await this.buildOpenApi(opts.path, false);
      specController = async (res) => {
        registerAbort(res);
        await sendFile({
          res,
          path: opts.path,
          contentType: "application/json",
          totalSize: length || Infinity,
        });
      };
    } else {
      const spec = this.openApiBuilder.getSpecAsJson();
      delete this.openApiBuilder;
      specController = new DeclarativeResponse()
        .writeHeaders({ "Content-Type": "application/json" })
        .end(spec);
    }
    var HERE = opts?.uiPath || "node_modules/@ublitzjs/openapi/ui";
    var paths = await analyzeFolder(HERE, opts?.clearMimes);
    const methods = staticServe({
      paths,
      fullRoute: prefix,
      dirPath: HERE,
    });

    this.get(prefix + "/*", methods.get)
      .head(prefix + "/*", methods.head)
      .any(prefix + "/*", methods.any)
      .get(prefix + "/openapi.json", specController)
      .get(
        prefix + "/swagger-initializer.js",
        new DeclarativeResponse()
          .writeHeader("Content-Type", "text/javascript")
          .end(
            `window.onload = async function(){window.ui=SwaggerUIBundle({url:"${prefix}/openapi.json",dom_id:"#swagger-ui",deepLinking:true,presets:[SwaggerUIBundle.presets.apis,SwaggerUIStandalonePreset],plugins:[SwaggerUIBundle.plugins.DownloadUrl],layout:"StandaloneLayout"})}`
          )
      );
  },
  async buildOpenApi(filePath, exitFromNodejs) {
    var spec = this.openApiBuilder.getSpecAsJson();
    delete this.openApiBuilder;
    var writeStream = createWriteStream(filePath);
    var offset = 0;
    var chunk = 64 * 1024 * 1024;
    while (spec[offset]) {
      var ok = writeStream.write(spec.slice(offset, (offset += chunk)));
      if (!ok)
        await new Promise((resolve) => writeStream.once("drain", resolve));
    }
    return new Promise((resolve) => {
      writeStream.end(() => {
        if (exitFromNodejs) exit(0);
        resolve(spec.length);
      });
    });
  },
});
var toOpenapiPath = (v) => v.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");
function RouterPlugin(methods) {
  var route = this.paths[this._currentPath];
  var openApiPath = route?.openapi || {};
  delete route?.openapi;
  for (const method of methods) {
    if (method === "connect") continue;
    openApiPath[method === "del" ? "delete" : method] = route[method].openapi;
    delete route[method].openapi;
  }
  this.server.openApiBuilder.addPath(
    toOpenapiPath(this.prefixedPath),
    openApiPath
  );
}
function routePlugin(route, server) {
  if (route.method === "connect") return;
  var methodOpenapi = route.openapi || {};
  delete route.openapi;
  server.openApiBuilder.addPath(toOpenapiPath(route.path), {
    [route.method]: methodOpenapi,
  });
}
export { serverExtension, RouterPlugin, routePlugin };
