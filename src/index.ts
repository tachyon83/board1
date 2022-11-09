import { AppDataSource } from './data-source'
import App from './app'
import UserController from './controllers/user.controller'
import UserService from './modules/User/service'
import BoardController from "./controllers/board.controller";
import BoardService from "./modules/Board/service";
import CommentController from "./controllers/comment.controller";
import CommentService from "./modules/Comment/service";

async function startServer() {
  AppDataSource.initialize()
    .then(async () => {
      console.log('AppDataSource initialized...')

      const app = new App([
          new UserController(new UserService()),
          new BoardController(new BoardService()),
          new CommentController(new CommentService()),
      ])
      app.listen()
    })
    .catch(error => console.log(error))
}

startServer()
