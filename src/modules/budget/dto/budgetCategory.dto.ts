import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsString
} from 'class-validator';

// 예산 설정 DTO
export class BudgetCategoryDto {
  @ApiProperty({ 
    description: '카테고리 id값', 
    required: true,
    example: 'BG2311120002'
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

}
