import { ICommonResponse } from './commonResponseInterface'

export default class CommonResponse implements ICommonResponse {
  data: Object
  message: string
  accessToken: string

  constructor(input: ICommonResponse) {
    const { data, message, accessToken } = input
    this.data = data
    this.message = message
    this.accessToken = accessToken
  }
}
