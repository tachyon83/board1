import * as express from 'express'
const Router = express.Router

import requestHandler from './request.handler'
import { jwtAuth } from '../utils/jwtAuthMiddleware'
import BaseController from './base.controller'

export default class UserController extends BaseController {
    path = '/user'

    constructor(service) {
        super(service)
        this.init()
    }

    init() {
        const router = Router()

        router.post('/', requestHandler(this.create))
        router.post('/login', jwtAuth, requestHandler(this.login))
        router.patch('/', jwtAuth, requestHandler(this.update))
        router.post('/delete', jwtAuth, requestHandler(this.delete))

        this.router.use(this.path, router)
    }

    create = async (req: express.Request, res: express.Response) => {
        return this.service.create(req.body)
    }

    login = async (req: express.Request, res: express.Response) => {
        return this.service.login(req.body)
    }

    update = async (req: express.Request, res: express.Response) => {
        return this.service.update(req.body.username, req.contextUserId)
    }

    delete = async (req: express.Request, res: express.Response) => {
        return this.service.delete(req.contextUserId)
    }
}
