import {MongoMemoryServer} from 'mongodb-memory-server';
import {GlobalContext} from "../core/context/global";
import {DatasourceBindings} from "../datasources/bindings";


let server: MongoMemoryServer;
beforeAll(async () => {
    server = new MongoMemoryServer()
    GlobalContext.get().bind(DatasourceBindings.MongoDatabaseName, await server.getDbName());
    GlobalContext.get().bind(DatasourceBindings.MongoUrl, await server.getUri());
})


afterAll(async () => {
    await server.stop()
})