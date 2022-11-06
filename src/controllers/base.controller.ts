import * as express from 'express'
const Router = express.Router

export default class BaseController {
    service
    router = Router()

    constructor(service) {
        this.service = service
    }
}
