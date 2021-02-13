import {GlobalContext} from "../../core/context/global";
import {DatasourceBindings} from "../bindings";
import redis from 'redis-mock';

export function createRedisConnection() {
    const client = redis.createClient();
    GlobalContext.get().bind(DatasourceBindings.Redis, client);
    return client;
}