import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { QueryDto } from './Query.dto';
import { UtilsService } from 'src/utils/Utils.service';
import * as querystring from 'querystring';
import { QueryResponseDto } from './QueryResponse.dto';
import { WebClientService } from 'src/webClient/WebClient.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/Order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueryService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private webClientService: WebClientService,
    private utilsService: UtilsService,
  ) {}

  async doQuery(queryDto: any): Promise<any> {
    try {
      // 檢核輸入
      this.validateOrder(queryDto);
      const orders = await this.findOrders(queryDto);

      if (orders.length != 0) {
        return new QueryResponseDto(true, 0, '成功', orders);
      } else {
        // DB查無資料，call 綠界查詢
        const params = this.generateToEcPayParams(queryDto);

        const response = this.webClientService.postForm(
          process.env.ECPAY_QUERY_URL,
          params,
        );

        const parsedData = querystring.parse((await response).data);

        // 綠界查無資料
        if (parsedData == undefined || parsedData.ItemName.length == 0) {
          return new QueryResponseDto(
            false,
            HttpStatus.NO_CONTENT,
            '查無資料',
            'No Data Found',
          );
        }
        // 成功查詢訂單
        console.log(querystring.parse((await response).data));
        return new QueryResponseDto(
          true,
          0,
          '成功',
          querystring.parse((await response).data),
        );
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        return new QueryResponseDto(
          false,
          error.response.statusCode,
          error.response.message,
          '',
        );
      } else if (error.request) {
        // 無回應
        return new QueryResponseDto(
          true,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'No Response',
          'No Response',
        );
      }
    }
  }

  validateOrder(queryDto: QueryDto) {
    if (
      queryDto.memberId == undefined &&
      queryDto.merchantTradeNo == undefined
    ) {
      throw new BadRequestException('請輸入顧客ID或訂單編號');
    }

    return true;
  }

  async findOrders(queryDto: QueryDto): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.order_details', 'orderDetail');

    const { merchantTradeNo, memberId } = queryDto;

    if (merchantTradeNo) {
      queryBuilder.andWhere('order.merchantTradeNo = :merchantTradeNo', {
        merchantTradeNo,
      });
    }

    if (memberId) {
      queryBuilder.andWhere('order.memberId = :memberId', { memberId });
    }

    return await queryBuilder.getMany();
  }

  generateToEcPayParams(queryOrderDto: QueryDto) {
    const params = {
      MerchantID: process.env.MERCHANT_ID,
      MerchantTradeNo: queryOrderDto.merchantTradeNo,
      TimeStamp: this.utilsService.getTimestamp(),
    };

    params['CheckMacValue'] = this.utilsService.createCheckMacValue(
      params,
      process.env.HASH_KEY,
      process.env.HASH_IV,
    );

    return params;
  }
}
