import { App } from "uWebSockets.js";
import { closure, extendApp, toAB, type onlyHttpMethods } from "@ublitzjs/core";
import { logger } from "@ublitzjs/logger";
import {
  serverExtension as openapiExtension,
  routePlugin,
  type methodAddOns,
} from "@ublitzjs/openapi";
import router from "./router.ts";
const server = extendApp(
  App(),
  // used template here
  openapiExtension({
    openapi: "3.0.2",
    info: {
      description:
        "This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.",
      version: "1.0.0",
      title: "Swagger Petstore",
      termsOfService: "http://swagger.io/terms/",
      contact: {
        email: "apiteam@swagger.io",
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    servers: [
      {
        url: "http://localhost:9001/",
      },
    ],
    tags: [
      {
        name: "pet",
        description: "Everything about your Pets",
        externalDocs: {
          description: "Find out more",
          url: "http://swagger.io",
        },
      },
    ],
    components: {
      schemas: {
        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
            },
            name: {
              type: "string",
            },
          },
          xml: {
            name: "Category",
          },
        },
        Tag: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
            },
            name: {
              type: "string",
            },
          },
          xml: {
            name: "Tag",
          },
        },
        Pet: {
          type: "object",
          required: ["name", "photoUrls"],
          properties: {
            id: {
              type: "integer",
              format: "int64",
            },
            category: {
              $ref: "#/components/schemas/Category",
            },
            name: {
              type: "string",
              example: "doggie",
            },
            photoUrls: {
              type: "array",
              xml: {
                name: "photoUrl",
                wrapped: true,
              },
              items: {
                type: "string",
              },
            },
            tags: {
              type: "array",
              xml: {
                name: "tag",
                wrapped: true,
              },
              items: {
                $ref: "#/components/schemas/Tag",
              },
            },
            status: {
              type: "string",
              description: "pet status in the store",
              enum: ["available", "pending", "sold"],
            },
          },
          xml: {
            name: "Pet",
          },
        },
      },
    },
    externalDocs: {
      description: "Find out more about Swagger",
      url: "http://swagger.io",
    },
  }),
  {
    // because of importing cjs
    async start() {
      await server.serveOpenApi("/documentation");
      server.listen("localhost", 9001, (token) =>
        token ? logger.info("good") : logger.error("bad")
      );
    },
  }
)
  .route<onlyHttpMethods, methodAddOns>(
    {
      openapi: {
        description: "fully typed route",
        deprecated: false,
        summary: "'core' package method",
      },
      controller: closure(() => {
        var message = toAB("hello");
        return (res) => res.end(message);
      }),
      method: "get",
      path: "/special",
    },
    [routePlugin]
  )
  .onError((err, res, data) => {
    logger.log("ERROR", err, data);
    if (!res.aborted && !res.finished) res.close();
  });

// exporting only type for convenience
export type currentServer = typeof server;

server.register(router);

server.start();
