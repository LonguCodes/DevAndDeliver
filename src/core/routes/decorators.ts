import {RouteRegistry, RouteType} from "./registry";

function register(type: RouteType) {
    return (route: string) =>
        (target: any, propertyKey: string) =>
            RouteRegistry.registerRoute(type, route, target[propertyKey]);
}
export const post = register('post');
export const get = register('get');
