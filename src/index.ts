import {startApplication} from "./app";
import {GlobalContext} from "./core/context/global";
import {DatasourceBindings} from "./datasources/bindings";
import {replaceEmpty} from "./core/utilities";
import dotenv from 'dotenv';
import {CoreBindings} from "./core/bindings";

dotenv.config()

GlobalContext.get().bind(CoreBindings.Debug, process.env.DEBUG?.toLowerCase() === 'true');
GlobalContext.get().bind(DatasourceBindings.MongoDatabaseName, 'DevAndDeliver');
GlobalContext.get().bind(DatasourceBindings.MongoUrl, replaceEmpty(process.env.DATABASE_URL, 'database'));
GlobalContext.get().bind(DatasourceBindings.RedisUrl, replaceEmpty(process.env.REDIS_URL, 'redis'));
startApplication()
    .then(() => {
        console.log('Server started on port 3000')
    })
    .catch((e) => {
        if (GlobalContext.get().getValue(CoreBindings.Debug))
            console.error(e)
        console.log(process.env)
        console.error('Failed to start the server')
    })

