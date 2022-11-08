import * as express from 'express'
const Router = express.Router

import requestHandler from './request.handler'
import { jwtAuth } from '../utils/jwtAuthMiddleware'
import BaseController from './base.controller'

export default class BoardController extends BaseController {
    path = '/board'

    constructor(service) {
        super(service)
        this.init()
    }

    init() {
        const router = Router()

        router.post('/',jwtAuth, requestHandler(this.create))

        this.router.use(this.path, router)
    }

    create = async (req: express.Request, res: express.Response) => {
        return this.service.create(req.body, req.contextUserId)
    }
}
