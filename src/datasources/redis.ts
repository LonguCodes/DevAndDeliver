import {GlobalContext} from "../core/context/global";
import {DatasourceBindings} from "./bindings";
import redis from 'redis';

export function createRedisConnection() {
    const url = GlobalContext.get().getValue(DatasourceBindings.RedisUrl) as string;
    const client = redis.createClient(url);
    GlobalContext.get().bind(DatasourceBindings.Redis, client);
    return client;
}