import './configs/dotenvConfig'
import * as express from 'express'
import { errorHandler } from './middlewares/error.handler'
import { notFoundHandler } from './middlewares/not.found.handler'
import UserController from "./controllers/user.controller";
import UserService from "./modules/User/service";

const Router = express.Router

export default class App {
  app

  constructor(controllers?) {
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
      controllers=[new UserController(new UserService()),]
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
