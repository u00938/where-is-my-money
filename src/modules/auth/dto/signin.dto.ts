import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignInDto {
  @ApiProperty({ 
    description: '계정', 
    required: true,
    example: 'username1'
  })
  @IsString()
  username: string

  @ApiProperty({
    description: '비밀번호',
    required: true,
    example: 'pwd231112@!'
  })
  @IsString()
  password: string
}
