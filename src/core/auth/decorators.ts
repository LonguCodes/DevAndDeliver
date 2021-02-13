import {ZoneContext} from "../context/zone";
import {AuthBindings} from "./bindings";
import {HttpErrors} from "../errors";

export function onlyLoggedIn(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalFunction = descriptor.value;
    descriptor.value = (...args: any[]) => {
        if (!ZoneContext.get()?.getValue(AuthBindings.User))
            throw new HttpErrors.Unauthorized()
        return originalFunction(...args);
    }
    Object.defineProperty(target, propertyKey, descriptor)
};
