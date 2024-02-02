import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthEntity } from './auth.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly jwtService: JwtService
  ) {}

  async login(user: AuthEntity) {
    const payload = {
      id: user.id,
      email: user.email
    }

    const jwtToken = this.jwtService.sign(payload)

    return {
      access_token: jwtToken,
      user: {
        ...user,
        password: undefined
      }
    }
  }

  async validate(email: string, password: string) {
    const user = await this.authRepository.findOne({
      where: {
        email
      }
    })
    if (password !== user.password) {
      throw new UnauthorizedException('unauthorized')
    }

    return {
      ...user
    }
  }
}
