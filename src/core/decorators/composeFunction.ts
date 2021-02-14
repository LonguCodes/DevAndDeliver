import 'reflect-metadata';
import {v4} from "uuid";


const composeMetadataKey = Symbol('metadata-key-compose')

export abstract class ComposeFunctionRegistry {
    private static _registry: { [x: string]: ComposeFunction } = {};

    static getComposableFunction(object: any, propertyKey: string) {
        if (!(propertyKey in object))
            return null;

        if (Reflect.hasMetadata(composeMetadataKey, object, propertyKey))
            return this._registry[Reflect.getMetadata(composeMetadataKey, object, propertyKey) as string]

        const fn = new ComposeFunction(object, propertyKey)
        const key = v4();
        this._registry[key] = fn;
        Reflect.defineMetadata(composeMetadataKey, key, object, propertyKey)
        return fn;
    }

    static createComposableDecorator(fn: Function) {
        return (object: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor.value = this.getComposableFunction(object, propertyKey)?.chain(fn)
    }
}

class ComposeFunction {

    private _chain: Function;

    constructor(private object: any, private  propertyKey: string) {
        this._chain = Object.getOwnPropertyDescriptor(object, propertyKey)?.value;
    }

    chain(fn: Function): any {
        const orig = this._chain.bind(this.object);
        const bound = fn.bind(this.object)
        const execute = this.execute;
        this._chain = (...args: any[]) => orig(...(bound(execute, ...args) ?? []))
        return execute
    }

    get execute(){
        return this._execute.bind(this);
    }

    private _execute(...args: any[]) {
        return this._chain(...args)
    }
}