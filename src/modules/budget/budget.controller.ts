import { Body, Controller, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetService } from './budget.service';
import { SetBudgetDto } from './dto/setBudget.dto';
import { AuthGuard } from '@nestjs/passport';

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


  @Post('/test')
  testData(): Promise<void> {
    return this.budgetService.testData();
  }

}
