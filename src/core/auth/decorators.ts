import {ZoneContext} from "../context/zone";
import {AuthBindings} from "./bindings";
import {HttpErrors} from "../errors";
import {ComposeFunctionRegistry} from "../decorators/composeFunction";

export const onlyLoggedIn = ComposeFunctionRegistry.createComposableDecorator((fn: Function, ...args: any[]) => {
    if (!ZoneContext.get()?.getValue(AuthBindings.User))
        throw new HttpErrors.Unauthorized()
    return args;
})
