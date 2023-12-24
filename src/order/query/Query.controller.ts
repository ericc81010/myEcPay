import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryService } from './Query.service';
import { QueryDto } from './Query.dto';
import { QueryResponseDto } from './QueryResponse.dto';

@Controller('ecpay')
export class QueryController {
  constructor(private readonly queryOrderService: QueryService) {}

  @Post('queryOrder')
  @HttpCode(HttpStatus.OK)
  async queryOrder(@Body() queryDto: QueryDto) {
    const result: QueryResponseDto =
      await this.queryOrderService.doQuery(queryDto);
    if (result != undefined) {
      if (result.msg == '查無資料') {
        return result;
      } else {
        return result;
      }
    } else {
      // errmsg
      return result;
    }
  }
}
