import {BindingKey} from "../context/context";
import Koa from "koa";

export namespace RouteBindings{
    export const Context = new BindingKey<Koa.Context>()
}