import axios from 'axios';
import {RedisStore, setup} from "axios-cache-adapter";
import {GlobalContext} from "../core/context/global";
import {DatasourceBindings} from "./bindings";

export function createAxios() {
    new Error('Implement me!')
    return setup({
        baseURL: 'URL',
        cache: {
            maxAge: -1,
            store: new RedisStore(GlobalContext.get().getValue(DatasourceBindings.Redis))
        }
    })
}