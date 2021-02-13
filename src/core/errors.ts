export abstract class HttpError {
    constructor(private _message?: string) {

    }

    abstract get code(): number;

    get message(): string {
        return this._message ?? Object.getPrototypeOf(this).constructor.name;
    }
}

export namespace HttpErrors {
    export class InternalError extends HttpError {
        get code() {
            return 500;
        }
    }

    export class BadRequest extends HttpError {
        get code() {
            return 400;
        }
    }

    export class Unauthorized extends HttpError {
        get code() {
            return 401;
        }
    }

    export class Forbidden extends HttpError {
        get code() {
            return 403;
        }
    }

    export class NotFound extends HttpError {
        get code() {
            return 404;
        }
    }
}