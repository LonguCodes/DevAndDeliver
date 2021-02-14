import {RouteRegistry, RouteType} from "./registry";
import {ComposeFunctionRegistry} from "../decorators/composeFunction";

function register(type: RouteType) {
    return (route: string) =>
        (object: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const composableFunction = ComposeFunctionRegistry.getComposableFunction(object, propertyKey);
            if (!composableFunction)
                return;
            RouteRegistry.registerRoute(type, route, composableFunction.execute)
            descriptor.value = composableFunction.execute;
        };
}

export const post = register('post');
export const get = register('get');
