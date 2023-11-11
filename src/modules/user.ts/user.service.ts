import { EntityNotFoundException } from '@/loader/exception/error.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity, EntityNotFoundError } from 'typeorm';

@Injectable()
export class UserService {
  constructor(

  ) {}
  // TODO: 에러핸들링
  async getUser(postId): Promise<object> {
    throw EntityNotFoundException('음' + ' is not found');
    return {};
  }

}
