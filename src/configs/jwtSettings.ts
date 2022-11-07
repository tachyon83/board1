export const JWT_SECRET = 'some secret'
export const JWT_ISSUER = 'some issuer'

export enum JWT_SUBJECT {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

export interface IJwtClaims {
  issuer?: string
  expiresIn: string
  subject: JWT_SUBJECT
}

export function jwtClaims(expiresIn: string, subject: JWT_SUBJECT): IJwtClaims {
  return {
    issuer: JWT_ISSUER,
    expiresIn,
    subject,
  }
}
