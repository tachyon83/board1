import { User } from "../modules/User/User";
import {ErrorLog} from "../modules/ErrorLog/ErrorLog";
import {Board} from "../modules/Board/Board";

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'test',
  synchronize: true,
  logging: false,
  entities: [ User, ErrorLog, Board ],
  migrations: [],
  subscribers: [],
  legacySpatialSupport: false,
}
