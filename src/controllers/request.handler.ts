import * as express from 'express'

export default function (handler) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const {
        status,
        data,
        message,
        accessToken,
        refreshToken,
      } = await handler(req, res)
      res.status(status).json({
        data,
        message,
        accessToken: req.newAccessToken ?? accessToken,
        refreshToken,
      })
    } catch (err) {
      next(err)
    }
  }
}
