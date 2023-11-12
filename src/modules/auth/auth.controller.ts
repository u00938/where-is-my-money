import {
  Controller,
  Post,
  Body,
  ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signin.dto'
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인 API',
    description: '호출자 로그인 후 토큰을 응답합니다.',
  })
  @Post('/signin')
  signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<object> {
    return this.authService.signIn(signInDto)
  }

}
