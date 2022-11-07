import { AppDataSource } from './data-source'
import App from './app'
import UserController from './controllers/user.controller'
import UserService from './modules/User/service'

async function startServer() {
  AppDataSource.initialize()
    .then(async () => {
      console.log('AppDataSource initialized...')

      const app = new App([
        new UserController(new UserService()),
      ])
      app.listen()
    })
    .catch(error => console.log(error))
}

startServer()
