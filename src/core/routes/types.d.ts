import Koa from "koa";
import {RouteType} from "./registry";

export type  Resolver = (ctx: Koa.Context) => any

export interface Route {
    resolver: Resolver;
    path: string;
    type: RouteType;
}
