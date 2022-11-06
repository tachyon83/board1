import { HttpException } from "./http.exception.js";
import exceptionMessages from "./exception.messages.js";

export class UnauthorizedException extends HttpException {
    constructor(message = exceptionMessages.unauthorized) {
        super(401, message);
    }
}
