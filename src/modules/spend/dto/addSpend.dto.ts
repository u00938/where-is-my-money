import { ApiProperty } from '@nestjs/swagger';
import {
  IsString
} from 'class-validator';

// 지출 생성 DTO
export class AddSpendDto {
  @ApiProperty({ 
    description: '유저 예산 카테고리 id값', 
    required: true,
    example: 'UBGC231113235512000155'
  })
  @IsString()
  userBudgetCategoryId: string;

  @ApiProperty({ 
    description: '지출액',
    required: true,
    example: '900000'
  })
  @IsString()
  spendAmount: string;

  @ApiProperty({ 
    description: '지출 상세',
    required: true,
    example: '아메리카노'
  })
  @IsString()
  description: string;

  @ApiProperty({ 
    description: '합계 여부',
    required: true,
    example: true
  })
  isSum: boolean;

  @ApiProperty({ 
    description: '지출 날짜',
    required: true,
    example: '2023-11-13'
  })
  @IsString()
  spendDate: string;

}
