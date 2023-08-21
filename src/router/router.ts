import 'reflect-metadata'
import swaggerUi, { JsonObject } from "swagger-ui-express"
import { Router, Request, Response, NextFunction } from "express"
import { Method, Aplication, Param, HttpStatusCode } from "./RouterTypes"
import { swaggerDefinitions } from './SwaggerDefinitions'
import { ObjectSchema } from 'joi'
import { ServiceError } from '../utils/errors/service.error'
import ui from "uniqid";

type ClassConstructor = new (...args: any[]) => any;
type DecoratorClass = (constructor: Function) => void
type DecoratorFunctionMethod = (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandlerController>) => void
type RequestHandlerController = (req: Request, res: Response, next: NextFunction) => Promise<void>
type ExpressMiddlewareType = (req: Request, res: Response, next: NextFunction) => Promise<void> | void

type ParameterDefinition = {
    [key: string]: {
        type: string,
        properties?: ParameterDefinition
    }
}

type ValidatorParameterType = {
    name: string
    from: Param
    validator: ObjectSchema
}

type Paramaters = { in: Param, name: string, required?: boolean, schemaName?: string, schema?: { "$ref": string } }
type Responses = { [key: string]: { description: string, schema: string } }
type RequestBody = { content: { [key: string]: { schema: { properties: { [key: string]: {} } } } } }
type Routes = { route: Route, path: string, method: Method, routerDecorationsFunctions: TypedPropertyDescriptor<RequestHandlerController> }
type Controllers = { [key: string]: { routes: Routes[], controller: ClassConstructor } }

type Route = {
    tags: string[],
    summary: string,
    description?: string,
    consumes: Aplication[],
    produces: Aplication[],
    parameters?: Paramaters[],
    middlewares?: ExpressMiddlewareType[],
    responses: Responses,
    requestBody?: RequestBody,
    validators: ValidatorParameterType[]
}

class RouterDesc {

    #services: Record<string, any>;
    #controllers: Controllers;

    #middlewares: ExpressMiddlewareType[]

    #routes: Routes[]
    #expressRouteresponses: Responses
    #routeParameters: Paramaters[]

    #routesRegistered: string[]
    #expressRouter: Router

    #validators: ValidatorParameterType[]

    #swaggerDocument: JsonObject

    constructor() {
        this.#services = {}
        this.#controllers = {}

        this.#middlewares = []

        this.#routes = []
        this.#expressRouteresponses = {}
        this.#routeParameters = []

        this.#routesRegistered = []
        this.#expressRouter = Router()

        this.#validators = []

        this.#swaggerDocument = swaggerDefinitions
        this.#swaggerDocument.definitions = {}

        if (this.#swaggerDocument.tags === undefined) this.#swaggerDocument.tags = []
        if (this.#swaggerDocument.paths === undefined) this.#swaggerDocument.paths = {}

        const http_port = process.env.API_HTTP_PORT ? parseInt(process.env.API_HTTP_PORT) : undefined;
        const https_port = process.env.API_HTTPS_PORT ? parseInt(process.env.API_HTTPS_PORT) : undefined;
        const host = process.env.API_HOST ?? 'localhost';

        if (host) {
            var servers: { url: string }[] = []
            if (http_port) {
                servers.push({ url: `http://${host}:${http_port}` });
            }
            if (https_port) {
                servers.push({ url: `http://${host}:${https_port}` });
            }
            if (servers.length > 0) {
                this.#swaggerDocument.servers = servers;
            }
        }
    }

    Router() {
        this.#injectServices();
        //console.log(JSON.stringify(this.#swaggerDocument));
        this.#expressRouter.use('/swagger', swaggerUi.serve, swaggerUi.setup(this.#swaggerDocument));
        return this.#expressRouter;
    }

    addController(name: string, controller: ClassConstructor) {
        this.#controllers[name] = {
            routes: this.#routes, controller
        };
        this.#routes = []
    }

    addService<T>(service: T) {
        try {
            if (service === null || typeof service !== 'object') throw new Error();

            const serviceType = service.constructor.name;
            this.#services[serviceType] = service;
        } catch (error) {
            console.log("No se pudieron añadir algunos servicios");
        }
    }

    addRoute(path: string, method: Method, routerDecorationsFunctions: TypedPropertyDescriptor<RequestHandlerController>, description?: string) {
        var _route: Route = {
            consumes: [Aplication.json],
            produces: [Aplication.json],
            responses: this.#expressRouteresponses,
            summary: description || "",
            parameters: this.#routeParameters,
            middlewares: this.#middlewares,
            tags: [],
            validators: this.#validators
        }
        var toDel: number[] = []
        this.#routeParameters.forEach((param, i) => {
            if (param.in == Param.body && param.schema && param.schemaName) {
                if (_route.requestBody == null) {
                    _route.requestBody = {
                        content: {
                            "application/json": {
                                schema: {
                                    properties: {}
                                }
                            }
                        }
                    }
                }
                _route.requestBody.content["application/json"].schema.properties[param.schemaName] = {
                    $ref: param.schema.$ref
                }
                toDel.push(i)
            }
            if (param.in == Param.param && !path.includes(`{${param.name}}`)) {
                console.log(`cant add route: ${path}, left param: ${param.name}`);
                return;
            }
        });
        toDel.forEach(item => {
            _route.parameters?.splice(item, 1);
        })
        this.#routes.push({ route: _route, path, routerDecorationsFunctions, method });
        this.#expressRouteresponses = {}
        this.#routeParameters = []
        this.#middlewares = []
        this.#validators = []
    }

    addMiddlewares(middlewares: ExpressMiddlewareType[]) {
        this.#middlewares.push(...middlewares)
    }

    addParameters(from: Param, schemaName: string, schemeObject: ObjectSchema | string) {
        const _schemeName = `${schemaName}${ui.time()}`;
        this.#routeParameters.push({
            in: from, name: schemaName,
            schemaName: schemaName ?? undefined,
            schema: schemaName ? { $ref: `#/definitions/${_schemeName}` } : undefined
        });
        if (typeof schemeObject == "string") {
            this.#swaggerDocument.definitions[_schemeName] = { type: schemeObject }
        } else {
            this.#validators.push({ name: schemaName, from, validator: schemeObject });
            const properties: ParameterDefinition = {};
            Object.entries(schemeObject.describe().keys).forEach(([k, v]) => {
                properties[k] = { type: (v as any).type }
            });
            this.#swaggerDocument.definitions[`${_schemeName}`] = {
                type: "object", properties
            }
        }
    }

    addResponses(httpStatusCode: HttpStatusCode, description?: string, response?: string) {
        this.#expressRouteresponses[httpStatusCode] = {
            description: description ?? "",
            schema: response ?? ""
        }
    }

    #injectServices() {
        Object.entries(this.#controllers).forEach(entrie => {
            try {
                let controllerName = entrie[0];
                let routes = entrie[1].routes;
                let controller = entrie[1].controller;
                let controllerMiddlewares = this.#middlewares;

                this.#swaggerDocument.tags.push({
                    name: controllerName
                });

                const paramTypes = Reflect.getMetadata('design:paramtypes', controller) || [];

                const args = paramTypes.map((paramType: any) => {
                    const service = this.#services[paramType.name];
                    return service;
                });
                args.forEach((a: any) => {
                    if (a === undefined) throw new Error();
                });
                let _controller = new controller(...args);

                routes.forEach(route => {
                    let method = route.method;
                    let routePath = `/${controllerName}${route.path}`;
                    try {
                        this.#routesRegistered.push(`${route.method} ${routePath}`);
                        if (this.#swaggerDocument.paths[routePath] == undefined) {
                            this.#swaggerDocument.paths[routePath] = {};
                        }
                        route.route.tags.push(controllerName)
                        const { middlewares, validators, ...data } = route.route;
                        this.#swaggerDocument.paths[routePath][method] = data;
                        let expressPath = routePath.replace('{', ':').replace('}', '');
                        let routeMiddlewares = route.route.middlewares || [];
                        switch (method) {
                            case Method.get: this.#expressRouter.get(expressPath, validatorMiddleware(route.route.validators), ...routeMiddlewares, ...controllerMiddlewares, route.routerDecorationsFunctions.value!.bind(_controller)); break
                            case Method.post: this.#expressRouter.post(expressPath, validatorMiddleware(route.route.validators), ...routeMiddlewares, ...controllerMiddlewares, route.routerDecorationsFunctions.value!.bind(_controller)); break
                            case Method.put: this.#expressRouter.put(expressPath, validatorMiddleware(route.route.validators), ...routeMiddlewares, ...controllerMiddlewares, route.routerDecorationsFunctions.value!.bind(_controller)); break
                            case Method.patch: this.#expressRouter.patch(expressPath, validatorMiddleware(route.route.validators), ...routeMiddlewares, ...controllerMiddlewares, route.routerDecorationsFunctions.value!.bind(_controller)); break
                            case Method.delete: this.#expressRouter.delete(expressPath, validatorMiddleware(route.route.validators), ...routeMiddlewares, ...controllerMiddlewares, route.routerDecorationsFunctions.value!.bind(_controller)); break
                        }
                    } catch (error) {
                        console.log((error as Error).message)
                        console.log(`cant put route: ${routePath}`)
                    }
                });

                this.#middlewares = [];
            } catch (error) {
                console.log("No se pudieron añadir algunos controladores");
            }
        });
    }
}

const validatorMiddleware = (validators: ValidatorParameterType[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Promise.all(validators.map((v) => {
                let data;
                switch (v.from) {
                    case Param.header:
                        data = req.get(v.name); break;
                    case Param.body:
                        data = req.body[v.name]; break;
                    case Param.param:
                        data = req.params[v.name]; break;
                    case Param.query:
                        data = req.query[v.name]; break;
                }
                if (!data) throw new ServiceError(`No existe '${v.name}' en el '${v.from}'.`)
                return v.validator.validateAsync(data, { abortEarly: false });
            }));
            next();
        } catch (error) {
            next(error)
        }
    }
}


var _router = new RouterDesc();

export function Controller(): DecoratorClass
export function Controller(controller?: string, description?: string) {
    return function (constructor: ClassConstructor) {
        _router.addController(controller || constructor.name.toLowerCase().replace("controller", ""), constructor);
    };
}

export function Get(): DecoratorFunctionMethod
export function Get(route: string, description?: string): DecoratorFunctionMethod
export function Get(route?: string, description?: string) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandlerController>) {
        _router.addRoute(route || "", Method.get, descriptor, description);
    };
}

export function Post(): DecoratorFunctionMethod
export function Post(route: string, description?: string): DecoratorFunctionMethod
export function Post(route?: string, description?: string) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandlerController>) {
        _router.addRoute(route || "", Method.post, descriptor, description);
    };
}

export function Put(): DecoratorFunctionMethod
export function Put(route: string, description?: string): DecoratorFunctionMethod
export function Put(route?: string, description?: string) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandlerController>) {
        _router.addRoute(route || "", Method.put, descriptor, description);
    };
}

export function Delete(): DecoratorFunctionMethod
export function Delete(route: string, description?: string): DecoratorFunctionMethod
export function Delete(route?: string, description?: string) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandlerController>) {
        _router.addRoute(route || "", Method.delete, descriptor, description);
    };
}

export function Path(): DecoratorFunctionMethod
export function Path(route: string, description?: string): DecoratorFunctionMethod
export function Path(route?: string, description?: string) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<RequestHandlerController>) {
        _router.addRoute(route || "", Method.patch, descriptor, description);
    };
}

export function FromQuery(schemaName: string): DecoratorFunctionMethod
export function FromQuery(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod
export function FromQuery(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod {
    return function (target: any, propertyKey: string) {
        _router.addParameters(Param.query, schemaName, schemeObject ?? "string");
    };
}

export function FromBody(schemaName: string): DecoratorFunctionMethod;
export function FromBody(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod
export function FromBody(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod {
    return function (target: any, propertyKey: string) {
        _router.addParameters(Param.body, schemaName, schemeObject ?? "string");
    };
}

export function FromHeader(schemaName: string): DecoratorFunctionMethod
export function FromHeader(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod
export function FromHeader(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod {
    return function (target: any, propertyKey: string) {
        _router.addParameters(Param.header, schemaName, schemeObject ?? "string");
    };
}

export function FromParam(schemaName: string): DecoratorFunctionMethod
export function FromParam(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod
export function FromParam(schemaName: string, schemeObject?: ObjectSchema | string): DecoratorFunctionMethod {
    return function (target: any, propertyKey: string) {
        _router.addParameters(Param.param, schemaName, schemeObject ?? "string");
    };
}

export function Responses(httpStatusCode: HttpStatusCode): DecoratorFunctionMethod
export function Responses(httpStatusCode: HttpStatusCode, description: string, response: string): DecoratorFunctionMethod
export function Responses(httpStatusCode: HttpStatusCode, description?: string, response?: string) {
    return function (target: any, propertyKey: string) {
        _router.addResponses(httpStatusCode, response);
    };
}
export function Middleware(middleware: ExpressMiddlewareType): DecoratorFunctionMethod
export function Middleware(middlewares: ExpressMiddlewareType[]): DecoratorFunctionMethod
export function Middleware(middlewares: any): DecoratorFunctionMethod {
    return function (target: any, propertyKey: string) {
        if (Array.isArray(middlewares))
            _router.addMiddlewares(middlewares);
        else
            _router.addMiddlewares([middlewares]);
    };
}

export function GlobalMiddleware(middleware: ExpressMiddlewareType): DecoratorFunctionMethod
export function GlobalMiddleware(middlewares: ExpressMiddlewareType[]): DecoratorFunctionMethod
export function GlobalMiddleware(middlewares: any) {
    return function (constructor: ClassConstructor) {
        if (Array.isArray(middlewares))
            _router.addMiddlewares(middlewares);
        else
            _router.addMiddlewares([middlewares]);
    };
}

export default _router