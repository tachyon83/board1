import * as express from 'express'

export default function (handler) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // const {
      //   status,
      //   data,
      //   message,
      //   accessToken,
      //   refreshToken,
      // } = await handler(req, res)
      const data=await handler(req,res)
      // console.log(16, handler)
      // console.log(17, status,data,message)
      res.status(200).json({
        data,
        // message:,
        // accessToken: req.newAccessToken ?? accessToken,
        // refreshToken,
      })
    } catch (err) {
      next(err)
    }
  }
}
