import { HttpException } from './http.exception.js'
import exceptionMessages from './exception.messages.js';

export class BadRequestException extends HttpException {
    constructor(message = exceptionMessages.badRequest) {
        super(400, message);
    }
}
