import { AppDataSource } from './data-source'
import App from './app'
import { ServerOptions } from './configs/config.common'
import { ContainerKeys } from './utils/enums'
import Container from 'typedi'
import UserController from './controllers/user.controller'
import UserService from './modules/User/service'

async function startServer() {
  AppDataSource.initialize()
    .then(async () => {
      console.log('AppDataSource initialized...')

      Container.set(ContainerKeys.ServerOption, ServerOptions)

      const app = new App([
        new UserController(new UserService()),
      ])
      app.listen()
    })
    .catch(error => console.log(error))
}

startServer()
