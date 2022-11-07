import {ErrorString} from "../utils/enums"
import {AppDataSource} from "../data-source"
import {ErrorLog} from "../modules/ErrorLog/ErrorLog"

export class CustomError extends Error {
  path
  constructor(message,path) {
    super(message)
    this.path=path
  }
}

export const errorHandler = async (err, req, res, next) => {
  const status = (e=>{
    // TODO: turn on/off logging upon serverOption
    switch (e.message) {
      case ErrorString.BadClientRequest: return 400
      case ErrorString.WrongJWT: return 401
      case ErrorString.DuplicateUserName: return 409
      default: return 500
    }
  })(err)

  const repo=AppDataSource.getRepository(ErrorLog)
  const inst=await repo.create({errorString: err.message, path: err.path})
  await repo.insert(inst)

  res.status(status).json({
    status,
    message:err.message,
  })
}
