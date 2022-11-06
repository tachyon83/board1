import { CommonUtils } from './CommonUtils'
export default (req, res, next) => {
    const currTime = CommonUtils.getNowMoment()
    console.log(`[TimeStamp] server called at: ${currTime.format('YYYY-MM-DD HH:mm:ss')}`)
    next()
}