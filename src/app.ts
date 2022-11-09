import './configs/dotenvConfig'
import * as express from 'express'
import { errorHandler } from './middlewares/error.handler'
import { notFoundHandler } from './middlewares/not.found.handler'
import UserController from "./controllers/user.controller";
import UserService from "./modules/User/service";
import Container from "typedi";
import {ContainerKeys} from "./utils/enums";
import {ServerOptions} from "./configs/config.common";
import BoardController from "./controllers/board.controller";
import BoardService from "./modules/Board/service";
import CommentController from "./controllers/comment.controller";
import CommentService from "./modules/Comment/service";

const Router = express.Router

export default class App {
  app

  constructor(controllers?) {
    Container.set(ContainerKeys.ServerOption, ServerOptions)

    this.app = express()

    this.initMiddlewares()
    this.initControllers(controllers)
    this.initErrorHandlers()
    this.initNotFoundHandler()
  }

  listen() {
    const port = process.env.PORT || 4000
    this.app.listen(port, () => {
      console.log(`App started listening on the port #:${port}`)
    })
  }

  getServer() {
    return this.app
  }

  initMiddlewares() {
    this.app.use(express.json())
  }

  initControllers(controllers?) {
    const router = Router()

    if(!controllers || controllers.length===0){
      controllers=[
          new UserController(new UserService()),
          new BoardController(new BoardService()),
          new CommentController(new CommentService()),
      ]
    }

    controllers.forEach(controller => {
      router.use(controller.router)
    })

    this.app.use('/', router)
  }

  initErrorHandlers() {
    this.app.use(errorHandler)
  }

  initNotFoundHandler() {
    this.app.use(notFoundHandler)
  }
}
