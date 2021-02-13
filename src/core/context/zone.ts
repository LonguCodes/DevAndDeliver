import {AsyncLocalStorage} from "async_hooks";
import {Binding, BindingKey, Context} from "./context";
import {v4} from "uuid";

const storage = new AsyncLocalStorage<ZoneContext>();

export function withZone(zoneBody: () => any, inherit = true) {

    const context = new ZoneContext(inherit ? ZoneContext.get() : undefined);
    return storage.run(context, zoneBody);
}

export class ZoneContext extends Context {
    private id: string;

    constructor(private parent?: ZoneContext) {
        super();
        this.id = v4();
    }

    getValue<T>(key: BindingKey<T>): T | undefined {
        return this.getBinding(key)?.value;
    }

    getBinding<T>(key: BindingKey<T>): Binding<T> | undefined {
        return super.getBinding(key) ?? this.parent?.getBinding(key);
    }


    static get(): ZoneContext | undefined {
        return storage.getStore()
    }
}
