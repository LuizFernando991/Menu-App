import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticatedRequest } from 'src/types/AuthRequest.type'
import { JwtPayload } from 'src/types/JwtPaylods.type'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    return request.user
  }
)
