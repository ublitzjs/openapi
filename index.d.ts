import type { HttpMethods, routeFNOpts, Server } from "@ublitzjs/core";
import type {
  ComponentsObject,
  InfoObject,
  TagObject,
  EncodingPropertyObject,
  ExternalDocumentationObject,
  ISpecificationExtension,
  OpenApiBuilder,
  ParameterObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  SecurityRequirementObject,
  ServerObject,
} from "openapi3-ts/oas31";

interface CallbacksObject extends ISpecificationExtension {
  [name: string]: CallbackObject | ReferenceObject;
}
interface CallbackObject extends ISpecificationExtension {
  [name: string]: PathItemObject;
}
interface ResponsesObject {
  default?: ResponseObject | ReferenceObject;
  [statuscode: string]: ResponseObject | ReferenceObject | undefined;
}
interface OperationObject extends ISpecificationExtension {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject | ReferenceObject;
  responses?: ResponsesObject;
  callbacks?: CallbacksObject;
  deprecated?: boolean;
  produces?: string[];
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
}
interface EncodingObject extends ISpecificationExtension {
  [property: string]: EncodingPropertyObject;
}

interface OpenAPIObject extends ISpecificationExtension {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths?: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
  webhooks?: PathsObject;
}
interface PathsObject extends ISpecificationExtension {
  [path: string]: PathItemObject;
}
interface PathItemObject extends ISpecificationExtension {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ServerObject[];
  parameters?: (ParameterObject | ReferenceObject)[];
}
/**
 * use it with "extPaths" type from @ublitzjs/router" or with 'server.route' from 'core' package
 * @see examples on github
 */
export type routeAddOns = {
  openapi?: {
    $ref?: string;
    summary?: string;
    description?: string;
    servers?: ServerObject[];
    parameters?: (ParameterObject | ReferenceObject)[];
  };
};
/**
 * use it with "extPaths" type from @ublitzjs/router" or with 'server.route' from 'core' package
 * @see examples on github
 */
export type methodAddOns = { openapi?: Partial<OperationObject> };
/**
 * function, which should be put into "extendApp"
 * @see https://github.com/ublitzjs/openapi/blob/main/examples/index.ts
 */
export function serverExtension(opts: OpenAPIObject): {
  openApiBuilder: OpenApiBuilder;
  /**
   * @param prefix url on which openapi will be served. You should note that an access to html page is kinda tricky: if prefix = "/docs", then you can't access http://localhost:port/docs BUT can access http://localhost:port/docs/ with the last slash. Or, if you want, just use http://localhost:port/docs/index.html - definitely works. Such a peculiarity of uWS wildcards.
   * @param opts use if don't need to dynamically take openapi from code. Properties: build (whether to build an openapi and to serve after this), path (to an openapi json file), clearMimes (same as in 'static' package "clearMimesList"), uiPath - path to folder with ui (defaults to node_modules/@ublitzjs/openapi/ui)
   */
  serveOpenApi(
    prefix: string,
    opts?: {
      build?: boolean;
      path?: string;
      clearMimes?: boolean;
      uiPath?: string;
    }
  ): Promise<void>;
  buildOpenApi(filePath: string, exitFromNodejs: boolean): Promise<number>;
};
/**
 * This function goes to ExtendedRouter from @ublitzjs/router. registers all methods to openapi
 * @see https://github.com/ublitzjs/openapi/blob/main/examples/router.cjs
 */
export function RouterPlugin(path: string, methods: string[]): void;
/**
 * this function goes to Server.route function from 'core' package. It lets you register all methods to openapi
 * @see https://github.com/ublitzjs/openapi/blob/main/examples/index.ts
 */
export function routePlugin<method extends HttpMethods>(
  route: routeFNOpts<method> & methodAddOns,
  server: Server & {
    openApiBuilder: OpenApiBuilder;
  }
): void;
