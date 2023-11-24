import { Body, Controller, Get, Post, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { AuthGuard } from '@nestjs/passport';
import { SetBudgetDto } from './dto/setBudget.dto';

@ApiTags('예산')
@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}
  
  @ApiOperation({ summary: '예산 설정' })
  @Post('/setting')
  @UseGuards(AuthGuard('jwt'))
  setBudget(
    @Body(ValidationPipe) setBudgetDto: SetBudgetDto,
    @Request() req
  ): Promise<object> {
    return this.budgetService.setBudget(req.user, setBudgetDto);
  }

  @ApiOperation({ summary: '예산 카테고리 목록' })
  @Get('/category')
  @UseGuards(AuthGuard('jwt'))
  getCategory(
  ): Promise<object> {
    return this.budgetService.getCategory();
  }

  @ApiOperation({ summary: '예산 추천' })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        example: {
          "result": [
            "식비-126000",
            "취미-387000",
            "주거-117000",
            "기타-270000"
          ]
        }
      }
    }
  })
  @ApiQuery({ 
    name: 'budget',
    required: true,
    description: '예산'
   })
  @Get('/recommendation')
  @UseGuards(AuthGuard('jwt'))
  getBudgetRecommendation(
    @Request() req,
    @Query() query: { budget: string }
  ): Promise<object> {
    return this.budgetService.getBudgetRecommendation(query);
  }

  @ApiExcludeEndpoint()
  @Post('/test')
  testData(): Promise<void> {
    return this.budgetService.testData();
  }

}
