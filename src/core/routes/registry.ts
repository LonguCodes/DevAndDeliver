import KoaRouter from '@koa/router';
import {Resolver, Route} from "./types";


export type RouteType = 'get' | 'post'

export abstract class RouteRegistry {
    private static routes: Route[] = [];

    public static registerRoute(type: RouteType, path: string, resolver: Resolver) {
        RouteRegistry.routes.push({type, path, resolver});
    }

    public static applyRoutes(router: KoaRouter) {
        const sorted = [...RouteRegistry.routes].sort((a, b) => a.path.localeCompare(b.path)).reverse();
        for (const route of sorted) {
            while (route.path.endsWith('/'))
                route.path = route.path.substr(0, route.path.length - 1);

            router[route.type](route.path, route.resolver);
        }
        return router;
    }

}