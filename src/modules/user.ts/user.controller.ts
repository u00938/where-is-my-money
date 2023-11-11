import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get('detail')
  async getUser(

  ) {
    const result = await this.userService.getUser('');
    return result;
  }

}
