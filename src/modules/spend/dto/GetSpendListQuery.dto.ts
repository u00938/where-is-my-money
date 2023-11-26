import { ApiProperty } from '@nestjs/swagger';
import {
  IsString
} from 'class-validator';

// 지출 목록 조회 DTO
export class GetSpendListQueryDto {
  @ApiProperty({ 
    description: '기간 조회(최소)', 
    required: true,
    example: '2023-11-01'
  })
  @IsString()
  periodStart: string;

  @ApiProperty({ 
    description: '기간 조회(최대)', 
    required: true,
    example: '2023-11-03'
  })
  @IsString()
  periodEnd: string;

  @ApiProperty({ 
    description: '카테고리(옵션)',
    required: false,
    example: '식비'
  })
  category: string;

  @ApiProperty({ 
    description: '최소 금액',
    required: true,
    example: '0'
  })
  minAmount: boolean;

  @ApiProperty({ 
    description: '최대 금액',
    required: true,
    example: '100000'
  })
  @IsString()
  maxAmount: string;

}
