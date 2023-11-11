import { EntityNotFoundException } from '@/loader/exception/error.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Entity, EntityNotFoundError } from 'typeorm';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getUser(postId): Promise<object> {

    this.logger.info("로그인 시도")
    throw EntityNotFoundException('음' + ' is not found');
    return {};
  }

}
