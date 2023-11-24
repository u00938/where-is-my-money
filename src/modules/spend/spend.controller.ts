import { Body, Controller, Get, Post, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpendService } from './spend.service';
import { AuthGuard } from '@nestjs/passport';
import { AddSpendDto } from './dto/addSpend.dto';

@ApiTags('지출')
@Controller('spend')
export class SpendController {
  constructor(private readonly spendService: SpendService) {}
  
  @ApiOperation({ summary: '지출 생성' })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  setBudget(
    @Body(ValidationPipe) addSpendDto: AddSpendDto,
    @Request() req
  ): Promise<object> {
    return this.spendService.addSpend(req.user, addSpendDto);
  }

}
