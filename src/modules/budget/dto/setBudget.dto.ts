import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsString
} from 'class-validator';

// 예산 설정 DTO
export class SetBudgetDto {
  @ApiProperty({ 
    description: '카테고리 id값', 
    required: true,
    example: 'username1'
  })
  @IsString()
  budgetCategoryId: string;

  @ApiProperty({ 
    description: '예산',
    required: true,
    example: '900000'
  })
  @IsString()
  budget: string;

  @ApiProperty({ 
    description: '시작 날짜',
    required: true,
    example: '2023-11-12'
  })
  @IsString()
  periodStart: string;

}
