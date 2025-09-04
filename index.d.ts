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
  openapi: {
    /**
    * Builder from "openapi3-ts" npm package. You can use it to dynamically insert paths, components, etc.
    * */
    builder: OpenApiBuilder;
    /**
     * @param prefix prefix for openapi UI to be served at. 
     * @param opts : build (if to save open api to some file and serve it after this), path (to an openapi json file), clearMimes (same as in 'static' package "clearMimesList"), uiPath - path to folder with ui (defaults to node_modules/@ublitzjs/openapi/ui)
     */
    serve(
      /**
      * url on which openapi will be served. openapi.json is served on http://hostname:port/PREFIX/openapi.json. Main page - http://hostname:port/PREFIX/  AND It ENDS with slash (uWS's quirk, not mine)  OR http://hostname:port/PREFIX/index.html
      * */
      prefix: string,
      opts?: {
        build?: boolean;
        path?: string;
        clearMimes?: boolean;
        uiPath?: string;
      }
    ): Promise<void>;
    /**
    * build openapi.json file in specified filePath AND if needed - exit afterwards.
    * @returns File size
    * */
    build(filePath: string, exitFromNodejs: boolean): Promise<number>;

  }
};
/**
 * This function goes to ExtendedRouter from @ublitzjs/router. registers all methods to openapi
 * @see https://github.com/ublitzjs/openapi/blob/main/examples/router.cjs
 */
export function RouterPlugin(methods: string[]): void;
/**
 * this function goes to Server.route function from 'core' package. It lets you register all methods to openapi
 * @see https://github.com/ublitzjs/openapi/blob/main/examples/index.ts
 */
export function routePlugin<method extends HttpMethods>(
  route: routeFNOpts<method> & methodAddOns,
  server: Server & {
    openapi: {
      builder: OpenApiBuilder;
    }
  }
): void;
