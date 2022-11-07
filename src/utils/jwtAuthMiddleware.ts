import { verify, updateToken, IJwtVerificationResponse } from './jwtUtils'
import * as express from 'express'
import {ErrorString} from "./enums";
import {CustomError} from "../middlewares/error.handler";

export const jwtAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const accessToken = req.headers.jwt_access_token_key
  // const refreshToken = req.headers[process.env.JWT_REFRESH_TOKEN_KEY]

  if (!accessToken) {
    return next(new CustomError(ErrorString.WrongJWT, 'jwtAuth_noAccessToken'))
  }

  try {
    const jwtVerification: IJwtVerificationResponse = await verify(accessToken)
    req.contextUserId = jwtVerification.decodedUserId
    return next()
  } catch (jwtVerification) {
    switch (jwtVerification.jwtVerificationError) {
      // // 토큰 만료
      // case 'TokenExpiredError':
      //   const newAccessToken = await updateToken(refreshToken)
      //   if (newAccessToken) {
      //     req.newAccessToken = newAccessToken
      //     return next()
      //   }
      //   return res.json({ ok: 'login session expired...need to re-login' })

      // 토큰 오염
      case 'JsonWebTokenError': return next(new CustomError(ErrorString.WrongJWT, 'jwtAuth_pollutedJwt'))

      default: return next(new CustomError(ErrorString.WrongJWT, 'jwtAuth_unknownErrorInJwt'))
    }
  }
}
