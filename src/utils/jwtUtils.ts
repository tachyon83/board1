import * as jwt from 'jsonwebtoken'
import {jwtClaims, IJwtClaims, JWT_SECRET} from '../configs/jwtSettings'
import { AppDataSource } from '../data-source'
import { User } from '../modules/User/User'

export interface IJwtVerificationResponse {
  jwtVerificationError: string | null
  decodedUserId: number | null
}

export function sign(payload, options: IJwtClaims) {
  const { expiresIn, subject, ...restOptions } = options

  return jwt.sign(payload, JWT_SECRET, {
    ...jwtClaims(expiresIn, subject),
    ...restOptions,
  })
}

export async function verify(
  token,
  options?
): Promise<IJwtVerificationResponse> {
  const jwtVerificationResponse: IJwtVerificationResponse = {
    jwtVerificationError: null,
    decodedUserId: null,
  }

  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    return new Promise(async (resolve, reject) => {
      if (err) {
        jwtVerificationResponse.jwtVerificationError = err.name
        return reject(jwtVerificationResponse)
      }

      if (decoded.hasOwnProperty('username')) {
        const user = await AppDataSource.getRepository(User).findOne({
          where: { username: decoded.username },
        })

        if (user) {
          jwtVerificationResponse.decodedUserId = user.userId
          return resolve(jwtVerificationResponse)
        }
      }

      jwtVerificationResponse.jwtVerificationError = 'JsonWebTokenError'
      return reject(jwtVerificationResponse)
    })
  })
}

export async function updateToken(refreshToken) {
  // call authentication server
  // if (refreshToken is valid) get the newAccessToken and return it
  // if not, then return null

  return 'newAccessToken'
}
