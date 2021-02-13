import Koa from 'koa';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from '@koa/router';
import {withZone, ZoneContext} from "./core/context/zone";
import {RouteRegistry} from "./core/routes/registry";
import {HttpError, HttpErrors} from "./core/errors";
import './controllers'
import {RouteBindings} from "./core/routes/bindings";
import {authenticate} from "./core/auth/auth";
import {createDatabaseConnection} from "./datasources/database";
import {DatasourceBindings} from "./datasources/bindings";
import {createAxios} from "./datasources/axios";
import {GlobalContext} from "./core/context/global";
import {AuthBindings} from "./core/auth/bindings";
import { replaceEmpty} from "./core/utilities";
import {createRedisConnection} from "./datasources/redis";



export function createApplication() {
    const app = new Koa();
    const router = new Router();

    RouteRegistry.applyRoutes(router);

    app.use(cors());
    app.use(json());
    app.use(bodyParser());
    app.use(async (ctx, next) => {
        ctx.type = 'application/json';
        try {
            const data = await next();
            ctx.body = JSON.stringify(data);
            ctx.status = 200;
        } catch (e: any) {
            if (!(e instanceof HttpError))
                e = new HttpErrors.InternalError()
            ctx.body = JSON.stringify({
                message: e.message,
                code: e.code,
            });
            ctx.status = e.code;
        }
    })
    app.use((ctx, next) => withZone(() => {
        ZoneContext.get()?.bind(RouteBindings.Context, ctx);
        return next()
    }))
    app.use(async (ctx, next) => {
        await authenticate(ctx);
        return next()
    })

    app.use(router.routes())
    app.use(router.allowedMethods({throw: true}));
    app.use(ctx => {
        throw new HttpErrors.NotFound();
    });
    return app;
}


export async function startApplication() {

    GlobalContext.get().bind(AuthBindings.Secret,  replaceEmpty(process.env.JWT_SECRET, 'secret') );

    const app = createApplication();
    await createRedisConnection()
    await createDatabaseConnection()
    GlobalContext.get().bind(DatasourceBindings.Axios, createAxios());

    return app.listen(3000)
}
