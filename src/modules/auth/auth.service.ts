import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/model/entities/User';
import { Repository } from 'typeorm';
import { EntityNotFoundException, ServerErrorException, UnauthorizedUserException } from '@/loader/exception/error.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import config from '@/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async signIn(signInDto: SignInDto): Promise<object> {
    try {
      const { username, password } = signInDto;

      const user = await this.userRepository.findOne({ where: { username } });

      if (!user) {
        throw EntityNotFoundException(`존재하지 않는 아이디입니다`);
      }

      const pwdCheck = await bcrypt.compare(password, user.password);

      if (!pwdCheck) {
        throw UnauthorizedUserException(`잘못된 비밀번호입니다`);
      }

      delete user.password;
      const payload = JSON.stringify(user);
      const accessToken = await this.getJwtAccessToken(JSON.parse(payload));

      return { accessToken };

    } catch (err) {
      throw ServerErrorException(err.message);
    }
  }

  // access token 생성
  async getJwtAccessToken(payload: object): Promise<string> {
    const token = await this.jwtService.sign(payload, {
      secret: config.token.accessTokenSecret,
      expiresIn: Number(
        config.token.accessTokenExp,
      ),
    })

    return token
  }

  // TODO: add refresh token
}
