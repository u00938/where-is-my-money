import { ApiProperty } from '@nestjs/swagger';
import {
  IsString
} from 'class-validator';
import { BudgetCategoryDto } from './budgetCategory.dto';

// 예산 설정 DTO
export class SetBudgetDto {
  @ApiProperty({ 
    description: '총 예산',
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

  @ApiProperty({ 
    description: '카테고리별 예산',
    required: true,
    example: {}
  })
  categoryBudget: Array<BudgetCategoryDto>
}
