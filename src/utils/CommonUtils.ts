import * as moment from 'moment'
import * as bcrypt from 'bcrypt'

class CommonUtilsCls {
  getNowMoment(): moment.Moment {
    return moment()
  }

  getNowDate() {
    return this.getNowMoment().toDate()
  }

  getNowForMysql() {
    return this.getNowMoment().format('YYYY-MM-DD HH:mm:ss')
  }

  getNowDateToken() {
    return this.getNowMoment().format('YYYY-MM-DD')
  }

  async getHashedPassword(password: string, saltRounds?: number): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds ?? 10)
    return bcrypt.hash(password, salt)
  }

  async comparePassword(inputPassword, password): Promise<boolean> {
    return bcrypt.compare(inputPassword, password)
  }
}

export const CommonUtils = new CommonUtilsCls()
