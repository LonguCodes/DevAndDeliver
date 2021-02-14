import axios from 'axios';
import {RedisStore, setup} from "axios-cache-adapter";
import {GlobalContext} from "../core/context/global";
import {DatasourceBindings} from "./bindings";

export function createAxios() {

    return setup({
        baseURL: 'https://swapi.dev/api/',
        cache: {
            maxAge: -1,
            store: new RedisStore(GlobalContext.get().getValue(DatasourceBindings.Redis))
        }
    })
}