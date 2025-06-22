var { DeclarativeResponse } = require("@ublitzjs/core");
var { ExtendedRouter } = require("@ublitzjs/router");
var { RouterPlugin: openapiRouterPlugin } = require("@ublitzjs/openapi");
var { Type } = require("@sinclair/typebox");
var router = new ExtendedRouter(
  {
    "/findByStatus/MultipleExamples": {
      get: {
        openapi: {
          tags: ["pet"],
          summary: "Finds Pets by status",
          description:
            "Multiple status values can be provided with comma separated strings",
          operationId: "findPetsByStatus",
          produces: ["application/xml", "application/json"],
          parameters: [
            {
              name: "status",
              in: "query",
              description:
                "Status values that need to be considered for filter",
              required: true,
              schema: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["available", "pending", "sold"],
                  default: "available",
                },
              },
              style: "form",
              explode: true,
              examples: {
                Available: {
                  summary: "Available",
                  description:
                    "Showing status of `available`, using `value` property",
                  value: "available",
                },
                Sold: {
                  summary: "Sold",
                  description:
                    "Showing status of `sold`, using `externalValue` property",
                  externalValue: "http://example.com/examples/dog.json",
                },
              },
            },
          ],
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Pet",
                    },
                  },
                  examples: {
                    "No Content": {
                      summary: "Example response showing no pets are matched",
                      description:
                        "An example response, using `value` property",
                      value: [],
                    },
                    "Example 1": {
                      summary: "Example response showing a regular response",
                      description: "Two pets are returned in this example.",
                      value: [
                        {
                          id: 1,
                          category: {
                            id: 1,
                            name: "cat",
                          },
                          name: "fluffy",
                          photoUrls: [
                            "http://example.com/path/to/cat/1.jpg",
                            "http://example.com/path/to/cat/2.jpg",
                          ],
                          tags: [
                            {
                              id: 1,
                              name: "cat",
                            },
                          ],
                          status: "available",
                        },
                        {
                          id: 2,
                          category: {
                            id: 2,
                            name: "dog",
                          },
                          name: "puppy",
                          photoUrls: ["http://example.com/path/to/dog/1.jpg"],
                          tags: [
                            {
                              id: 2,
                              name: "dog",
                            },
                          ],
                          status: "available",
                        },
                      ],
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid status value",
            },
          },
          security: [
            {
              petstore_auth: ["write:pets", "read:pets"],
            },
          ],
        },
        controller: new DeclarativeResponse()
          .writeHeaders({ "Content-Type": "text/plain" })
          .end("HELLO"),
      },
    },
    "/": {
      post: {
        openapi: {
          tags: ["pet"],
          summary: "Add a new pet to the store",
          description: "some description",
          operationId: "addPet",
          requestBody: {
            description: "Pet object that needs to be added to the store",
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
                examples: {
                  Cat: {
                    summary: "An example of cat",
                    description: "An example of cat, using `value` property",
                    value: {
                      id: 1,
                      category: {
                        id: 1,
                        name: "cat",
                      },
                      name: "fluffy",
                      photoUrls: [
                        "http://example.com/path/to/cat/1.jpg",
                        "http://example.com/path/to/cat/2.jpg",
                      ],
                      tags: [
                        {
                          id: 1,
                          name: "cat",
                        },
                      ],
                      status: "available",
                    },
                  },
                  Cat2: {
                    summary: "An example of cat",
                    description:
                      "An example of cat, using `value` property, which value is an array",
                    value: [
                      {
                        id: 1,
                        category: {
                          id: 1,
                          name: "cat",
                        },
                        name: "fluffy",
                        photoUrls: [
                          "http://example.com/path/to/cat/1.jpg",
                          "http://example.com/path/to/cat/2.jpg",
                        ],
                        tags: [
                          {
                            id: 1,
                            name: "cat",
                          },
                        ],
                        status: "available",
                      },
                    ],
                  },
                  Dog: {
                    summary: "An example of dog",
                    description:
                      "An example of dog, using `externalValue` property",
                    externalValue: "http://example.com/examples/dog.json",
                  },
                },
              },
              "application/xml": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
                examples: {
                  Cat: {
                    summary: "An example of cat",
                    description: "An example of cat, using `value` property",
                    value: "<xml></xml>",
                  },
                  Dog: {
                    summary: "An example of dog",
                    description:
                      "An example of dog, using `externalValue` property",
                    externalValue: "http://example.com/examples/dog.xml",
                  },
                },
              },
            },
          },
          responses: {
            405: {
              description: "Invalid input",
            },
          },
        },
        controller: new DeclarativeResponse().end("hi"),
      },
    },
    "/findByStatus/singleExample": {
      get: {
        openapi: {
          tags: ["pet"],
          summary: "Finds Pets by status",
          description:
            "Multiple status values can be provided with comma separated strings",
          operationId: "findPetsByStatus",
          produces: ["application/xml", "application/json"],
          parameters: [
            {
              name: "status",
              in: "query",
              description:
                "Status values that need to be considered for filter",
              required: true,
              schema: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["available", "pending", "sold"],
                  default: "available",
                },
              },
              style: "form",
              explode: true,
              example: {
                summary: "Available",
                description:
                  "Showing status of `available`, using `value` property",
                value: "available",
              },
            },
          ],
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Pet",
                    },
                  },
                  example: {
                    summary: "Example response showing a regular response",
                    description: "Two pets are returned in this example.",
                    value: [
                      {
                        id: 1,
                        category: {
                          id: 1,
                          name: "cat",
                        },
                        name: "fluffy",
                        photoUrls: [
                          "http://example.com/path/to/cat/1.jpg",
                          "http://example.com/path/to/cat/2.jpg",
                        ],
                        tags: [
                          {
                            id: 1,
                            name: "cat",
                          },
                        ],
                        status: "available",
                      },
                      {
                        id: 2,
                        category: {
                          id: 2,
                          name: "dog",
                        },
                        name: "puppy",
                        photoUrls: ["http://example.com/path/to/dog/1.jpg"],
                        tags: [
                          {
                            id: 2,
                            name: "dog",
                          },
                        ],
                        status: "available",
                      },
                    ],
                  },
                },
              },
            },
            400: {
              description: "Invalid status value",
            },
          },
          security: [
            {
              petstore_auth: ["write:pets", "read:pets"],
            },
          ],
        },
        controller: new DeclarativeResponse().end("JI"),
      },
    },
  },
  [openapiRouterPlugin]
);
/**
 * using jsdoc in CJS
 * @param {import("./index.ts").currentServer} server
 */
module.exports = (server) => {
  router
    .bind(server)
    .prefix("/pet")
    .define("/", "post")
    .define("/findByStatus/MultipleExamples", "get")
    .define("/findByStatus/singleExample", "get");
};
