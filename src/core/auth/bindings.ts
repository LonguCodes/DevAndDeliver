import {BindingKey} from "../context/context";
import {User} from "./types";

export namespace AuthBindings{
    export const User = new BindingKey<User>()
    export const Secret = new BindingKey<string>()
}