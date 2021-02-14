import 'reflect-metadata';
import {ComposeFunctionRegistry} from "../decorators/composeFunction";
import {ZoneContext} from "../context/zone";
import {RouteBindings} from "../routes/bindings";
import {HttpErrors} from "../errors";

const functionMetadataKey = Symbol('request-metadata-function');
const parameterMetadataKey = Symbol('request-metadata-parameter');

interface RequestMetadata {
    part: string,
    key?: string
    transform?: (value: any) => any
    required: boolean
}

function requestPart(requestPart: 'body' | 'query' | 'params', transform?: (value: any) => any) {
    return (key: string | undefined, required = true) =>
        (object: Object,
         propertyKey: string,
         parameterIndex: number) => {
            const parameterMetadata = Reflect.getMetadata(parameterMetadataKey, object, propertyKey);
            Reflect.defineMetadata(parameterMetadataKey, {
                ...parameterMetadata, [parameterIndex]: {
                    part: requestPart,
                    key,
                    transform,
                    required
                }
            }, object, propertyKey)
            if (Reflect.hasMetadata(functionMetadataKey, object, propertyKey))
                return;
            const composableFunction = ComposeFunctionRegistry.getComposableFunction(object, propertyKey)
            composableFunction?.chain((fn: Function, ...args: any[]) => {
                const argsMetadata = Reflect.getMetadata(parameterMetadataKey, object, propertyKey)
                const request = ZoneContext.get()?.getValue(RouteBindings.Context)
                if (request)
                    for (const [key, value] of Object.entries(argsMetadata)) {
                        const {part, key: partKey, transform, required} = value as RequestMetadata;
                        let argValue = request[part]
                        if (partKey)
                            argValue = argValue[partKey]
                        if (required && !argValue)
                            throw new HttpErrors.BadRequest(`${partKey} is required in ${part}`)
                        if (transform)
                            argValue = transform(argValue)
                        args[parseInt(key)] = argValue;
                    }
                return args
            })
        }
}

export namespace request {
    export namespace params {
        export const number = requestPart('params', x => parseFloat(x))
        export const string = requestPart('params')
        export const boolean = requestPart('params', x => x.toLowerCase() === 'true')
        export const object = requestPart('params', x => JSON.parse(x))
    }
    export namespace query {
        export const number = requestPart('query', x => parseFloat(x))
        export const string = requestPart('query')
        export const boolean = requestPart('query', x => x.toLowerCase() === 'true')
        export const object = requestPart('query', x => JSON.parse(x))
    }
    export const body = (required = true) => requestPart('body')(undefined)
}


