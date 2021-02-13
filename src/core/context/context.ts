import {v4} from "uuid";

export abstract class Context {
    _bindings: { [key: string]: Binding<any> } = {};


    getBinding<T>(key: BindingKey<T>): Binding<T> | undefined {
        return this._bindings[key.raw];
    }

    getValue<T>(key: BindingKey<T>): T | undefined {
        return this.getBinding(key)?.value
    }

    bind<T>(key: BindingKey<T>, value: T): void {
        if (this.hasBinding(key)) throw new Error("Binding already exists");
        this._bindings[key.raw] = new DirectBinding<T>(value);
    }


    hasBinding<T>(key: BindingKey<T>): boolean {
        return key.raw in this._bindings;
    }
}

export class BindingKey<T> {

    _raw: string;

    constructor() {
        this._raw = v4()
    }

    get raw(): string {
        return this._raw;
    }
}

export abstract class Binding<T> {
    abstract get value(): T;
}

export class DirectBinding<T> extends Binding<T> {
    constructor(private _value: T) {
        super();
    }

    get value(): T {
        return this._value;
    }
}