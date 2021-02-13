import Koa from "koa";



export function authenticate(ctx: Koa.Context) {
    const token = ctx.req.headers["authorization"]?.substr(7);
    if (!token) return;
    throw new Error("Implement me!")
}