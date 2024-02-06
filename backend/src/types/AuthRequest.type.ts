import { Request } from 'express'
import { AuthEntity } from '../auth/auth.entity'

export class AuthRequest extends Request {
  user: AuthEntity
}
