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
        router.get('/', requestHandler(this.read))
        router.get('/search', requestHandler(this.search))
        router.delete('/', jwtAuth, requestHandler(this.delete))
        router.get('/my', jwtAuth, requestHandler(this.getMyPosts))

        this.router.use(this.path, router)
    }

    create = async (req: express.Request, res: express.Response) => {
        return this.service.create(req.body, req.contextUserId)
    }

    read = async (req:express.Request, res: express.Response) => {
        return this.service.read(req.query.boardId)
    }

    search = async (req:express.Request, res: express.Response) => {
        return this.service.search(req.query.searchText)
    }

    delete = async (req:express.Request, res: express.Response) => {
        return this.service.delete(req.query.boardId, req.contextUserId)
    }

    getMyPosts = async (req:express.Request, res: express.Response) => {
        return this.service.getMyPosts(req.contextUserId)
    }
}
