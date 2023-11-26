import { Body, Controller, Get, Post, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpendService } from './spend.service';
import { AuthGuard } from '@nestjs/passport';
import { AddSpendDto } from './dto/addSpend.dto';
import { GetSpendListQueryDto } from './dto/GetSpendListQuery.dto';

@ApiTags('지출')
@Controller('spend')
export class SpendController {
  constructor(private readonly spendService: SpendService) {}
  
  @ApiOperation({ summary: '지출 생성' })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  addSpend(
    @Body(ValidationPipe) addSpendDto: AddSpendDto,
    @Request() req
  ): Promise<object> {
    return this.spendService.addSpend(req.user, addSpendDto);
  }

  @ApiOperation({ summary: '지출 조회' })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getSpendList(
    @Request() req,
    @Query(ValidationPipe) getSpendListQueryDto: GetSpendListQueryDto,
  ): Promise<object> {
    return this.spendService.getSpendList(req.user, getSpendListQueryDto);
  }

}
