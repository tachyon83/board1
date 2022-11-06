import * as moment from 'moment'
import { CommonUtils } from '../src/utils/CommonUtils'

jest.setTimeout(20000)

export function setNow(momentParsableString: string = '2020-01-01 00:00:00') {
  const momentToReturn = moment(momentParsableString)

  jest
    .spyOn(CommonUtils, 'getNowMoment')
    .mockImplementation(() => momentToReturn.clone())
}
