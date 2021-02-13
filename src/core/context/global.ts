import {Context} from "./context";


export class GlobalContext extends Context {

    static _instance: GlobalContext;

    private constructor() {
        super();
        if (GlobalContext._instance)
            return GlobalContext._instance;
        GlobalContext._instance = this;
    }


    static get(): GlobalContext {
        return new GlobalContext();
    }
}
