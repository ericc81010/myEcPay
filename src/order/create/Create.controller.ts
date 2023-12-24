import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateService } from './Create.service';
import { CreateDto } from './Create.dto';
import { CreateResponseDto } from './CreateResponse.dto';

@Controller('ecpay')
export class CreateOrderController {
  constructor(private readonly createService: CreateService) {}

  @Post('createOrder')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() createDto: CreateDto) {
    const result: CreateResponseDto =
      await this.createService.doCreate(createDto);

    if (result.success) {
      return result.ecPayResponsData;
    } else {
      // errmsg
      return result.msg;
    }
  }
}
