import { verify, updateToken, IJwtVerificaitonResponse } from './jwtUtils'
import * as express from 'express'

export const jwtAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // const accessToken = req.headers[process.env.JWT_ACCESS_TOKEN_KEY]
  const accessToken = req.headers.JWT_ACCESS_TOKEN_KEY
  const refreshToken = req.headers[process.env.JWT_REFRESH_TOKEN_KEY]

  if (!accessToken || !refreshToken) {
    throw new Error('no authentication token')
    // return res.json({
    //   result: false,
    //   code: resCode.notAuthenticated,
    //   data: null,
    // })
  }

  try {
    const jwtVerification: IJwtVerificaitonResponse = await verify(accessToken)
    req.contextUserId = jwtVerification.decodedUserId
    return next()
  } catch (jwtVerification) {
    switch (jwtVerification.jwtVerificationError) {
      // 토큰 만료
      case 'TokenExpiredError':
        const newAccessToken = await updateToken(refreshToken)
        if (newAccessToken) {
          req.newAccessToken = newAccessToken
          return next()
        }
        return res.json({ ok: 'login session expired...need to re-login' })

      // 토큰 오염
      case 'JsonWebTokenError':
        return res.json({ result: 'invalid token' })

      default:
        console.log(
          'unknown...but error anyways',
          jwtVerification.jwtVerificationError
        )
        return res.json({ result: 'unknown error case' })
    }
  }
}
