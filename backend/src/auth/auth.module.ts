import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthEntity } from './auth.entity'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret'
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
