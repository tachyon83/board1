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
    issuer: process.env.JWT_ISSUER,
    expiresIn,
    subject,
  }
}
