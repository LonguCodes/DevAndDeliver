import {MongoClient} from "mongodb";
import {GlobalContext} from "../core/context/global";
import {DatasourceBindings} from "./bindings";

export async function createDatabaseConnection() {
    const url = GlobalContext.get().getValue(DatasourceBindings.MongoUrl);
    if (!url)
        throw new Error("Database connection can't be established")
    const client = new MongoClient(`mongodb://${url}`, {useUnifiedTopology: true});

    await client.connect();
    const db = client.db(GlobalContext.get().getValue(DatasourceBindings.MongoDatabaseName));
    GlobalContext.get()?.bind(DatasourceBindings.Mongo, db);
    GlobalContext.get()?.bind(DatasourceBindings.MongoClient, client);
    return db;
}