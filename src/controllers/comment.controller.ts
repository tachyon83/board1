import * as express from 'express'
const Router = express.Router

import requestHandler from './request.handler'
import { jwtAuth } from '../utils/jwtAuthMiddleware'
import BaseController from './base.controller'

export default class CommentController extends BaseController {
    path = '/comment'

    constructor(service) {
        super(service)
        this.init()
    }

    init() {
        const router = Router()

        router.post('/',jwtAuth, requestHandler(this.create))
        router.get('/', requestHandler(this.get))
        router.patch('/', jwtAuth, requestHandler(this.update))
        router.delete('/', jwtAuth, requestHandler(this.delete))

        this.router.use(this.path, router)
    }

    create = async (req: express.Request, res: express.Response) => {
        return this.service.create(req.body, req.contextUserId)
    }

    get = async (req:express.Request, res: express.Response) => {
        return this.service.read(req.query.boardId)
    }

    update = async (req:express.Request, res: express.Response) => {
        return this.service.update(req.body, req.contextUserId)
    }

    delete = async (req:express.Request, res: express.Response) => {
        return this.service.delete(req.query.commentId, req.contextUserId)
    }
}
