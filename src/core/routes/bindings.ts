import {BindingKey} from "../context/context";
import {Context} from 'koa'

export namespace RouteBindings{
    export const Context = new BindingKey<Context>()
}