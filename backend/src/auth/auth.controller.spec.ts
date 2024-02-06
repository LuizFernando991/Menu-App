import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthRequest } from '../types/AuthRequest.type'
import { LocalAuthGuard } from '../guards/local-auth.guard'

jest.mock('./auth.service')

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService]
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        id: 'randomId',
        email: 'test@email.com',
        password: 'testPassword'
      })
      .compile() // Override LocalAuthGuard

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  describe('login', () => {
    it('should return a JWT token upon successful login', async () => {
      const mockUser = {
        id: 'randomId',
        email: 'test@email.com',
        password: 'testPassword'
      }
      const mockToken = 'mockedJwtToken'

      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ access_token: mockToken, user: mockUser })

      const result = await authController.login({
        user: mockUser
      } as AuthRequest)

      expect(result.access_token).toEqual(mockToken)
      expect(result.user.email).toEqual(mockUser.email)
      expect(authService.login).toHaveBeenCalledWith(mockUser)
    })
  })
})
