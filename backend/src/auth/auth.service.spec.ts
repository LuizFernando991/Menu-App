import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AuthEntity } from './auth.entity'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'

describe('AuthService', () => {
  let authService: AuthService
  let jwtService: JwtService

  const mockAuthRepository = {
    findOne: jest.fn()
  }

  const mockJwtService = {
    sign: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthEntity),
          useValue: mockAuthRepository
        },
        { provide: JwtService, useValue: mockJwtService }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return access token and user without password', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'password123'
      } as AuthEntity
      const expectedPayload = { id: user.id, email: user.email }
      const expectedToken = 'generated_token'

      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(expectedToken)

      const result = await authService.login(user)

      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload)
      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          ...user,
          password: undefined
        }
      })
    })
  })

  describe('validate', () => {
    it('should return user if email and password are valid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'password123'
      } as AuthEntity

      jest.spyOn(mockAuthRepository, 'findOne').mockResolvedValueOnce(user)

      const result = await authService.validate(user.email, user.password)

      expect(mockAuthRepository.findOne).toHaveBeenCalledWith({
        where: { email: user.email }
      })
      expect(result).toEqual({ ...user })
    })

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'password123'
      } as AuthEntity

      jest.spyOn(mockAuthRepository, 'findOne').mockResolvedValueOnce(user)

      await expect(
        authService.validate(user.email, 'incorrectPassword')
      ).rejects.toThrow(UnauthorizedException)
    })
  })
})
