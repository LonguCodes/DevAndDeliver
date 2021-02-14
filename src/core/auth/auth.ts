import Koa from "koa";
import jwt from 'jsonwebtoken'
import {GlobalContext} from "../context/global";
import {AuthBindings} from "./bindings";
import {DatasourceBindings} from "../../datasources/bindings";
import {TokenPayload} from "./types";
import moment from "moment";
import {ObjectId} from "mongodb";
import {ZoneContext} from "../context/zone";


export async function authenticate(ctx: Koa.Context) {
    const mongo = GlobalContext.get().getValue(DatasourceBindings.Mongo)
    if (!mongo)
        throw new Error("Can't access mongo db");


    const token = ctx.req.headers["authorization"]?.substr(7);


    if (!token) return;
    try {
        const {
            userId,
            sessionId
        } = jwt.verify(token, GlobalContext.get().getValue(AuthBindings.Secret) as string) as TokenPayload

        if (!await mongo.collection('session').findOne({
            _id: new ObjectId(sessionId),
            userId:new ObjectId(userId),
            expiresAt: {$gte: moment.utc().toISOString()}
        }))
            return;
        const user = await mongo.collection('user').findOne({_id: new ObjectId(userId)})
        ZoneContext.get()?.bind(AuthBindings.User, user)
    } catch {
    }
}