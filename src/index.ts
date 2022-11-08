import { AppDataSource } from './data-source'
import App from './app'
import UserController from './controllers/user.controller'
import UserService from './modules/User/service'
import BoardController from "./controllers/board.controller";
import BoardService from "./modules/Board/service";

async function startServer() {
  AppDataSource.initialize()
    .then(async () => {
      console.log('AppDataSource initialized...')

      const app = new App([
          new UserController(new UserService()),
          new BoardController(new BoardService()),
      ])
      app.listen()
    })
    .catch(error => console.log(error))
}

startServer()
