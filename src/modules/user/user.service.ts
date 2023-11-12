import {
  Inject,
  Injectable
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import bcrypt from 'bcryptjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EntityManager } from 'typeorm';
import { EntityConflictException, ServerErrorException } from '@/loader/exception/error.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly entityManager: EntityManager
  ) {}

  // 회원가입
  async signUp(registerUserDto: RegisterUserDto): Promise<object> {
    try {
      const { username, password } = registerUserDto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await this.entityManager.query(`
      SELECT insert_user(?, ?) AS _id
      `, [
        username,
        hashedPassword
      ]);
  
      if (user[0]._id === 'DUPLICATED USERNAME') {
        this.logger.debug(`${user[0]._id.toLowerCase()} - ${username}`);
        throw EntityConflictException(`이미 사용 중인 아이디입니다`);
      }
  
      return { message: '회원가입에 성공했습니다' };
    } catch (err) {
      throw ServerErrorException(err.message);
    }
  }

}
