import { Injectable } from '@nestjs/common';
// import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateDto } from './Create.dto';
import { CreateResponseDto } from './CreateResponse.dto';
import { UtilsService } from 'src/utils/Utils.service';
import * as moment from 'moment';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebClientService } from 'src/webClient/WebClient.service';
import { Order } from '../entities/Order.entity';
import { OrderDetail } from '../entities/OrderDetail.entity';

@Injectable()
export class CreateService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    private webClientService: WebClientService,
    private utilsService: UtilsService,
  ) {}

  // @Transactional()
  async doCreate(createDto: CreateDto): Promise<any> {
    try {
      // 檢核輸入
      this.validateOrder(createDto);

      // 準備給ecpay的資料
      const params = this.generateToEcPayParams(createDto);

      // call ecPay
      const response = this.webClientService.postForm(
        process.env.ECPAY_CREATE_URL,
        params,
      );

      if (response != undefined) {
        if ((await response).status == 200) {
          // 整理insert的資料
          this.generateInsertParams(createDto, params);
          this.insertOrder(createDto);

          return new CreateResponseDto(
            true,
            params.MerchantTradeNo,
            '成功',
            (await response).data,
          );
        }
      } else {
        return new CreateResponseDto(
          false,
          params.MerchantTradeNo,
          '建立訂單失敗',
          '',
        );
      }
    } catch (error) {
      // 處理錯誤
      console.error(error);
      throw error;
    }
  }

  generateInsertParams(createDto: CreateDto, ecPayParams: any) {
    createDto.merchantTradeNo = ecPayParams.MerchantTradeNo;
    createDto.merchantTradeDate = ecPayParams.MerchantTradeDate;
    createDto.choosePayment = ecPayParams.ChoosePayment;
    createDto.checkMacValue = ecPayParams.CheckMacValue;
    createDto.status = '建立訂單';
  }

  async insertOrder(createDto: CreateDto) {
    try {
      const order = this.orderRepository.create(createDto);
      await this.orderRepository.save(order);

      const orderDetail = this.orderDetailRepository.create({
        ...createDto,
        order: order, // 設定關聯
      });
      await this.orderDetailRepository.save(orderDetail);
    } catch (error) {
      console.error(error);
    }
  }

  validateOrder(createOrderDto: CreateDto) {
    if (
      !Number.isInteger(Number(createOrderDto.totalAmount)) ||
      createOrderDto.totalAmount <= 0
    ) {
      throw new BadRequestException('交易金額必須是整數');
    }

    const itemLen = createOrderDto.itemName.length;
    if (itemLen > 400 && itemLen > 0) {
      throw new BadRequestException('商品名稱必須小於400字且不得空白');
    }

    if (createOrderDto.memberId == undefined) {
      throw new BadRequestException('請輸入顧客ID');
    }

    if (createOrderDto.memberName == undefined) {
      throw new BadRequestException('請輸入顧客姓名');
    }

    if (createOrderDto.memberPhone == undefined) {
      throw new BadRequestException('請輸入顧客聯絡電話');
    }

    if (createOrderDto.sendAddress == undefined) {
      throw new BadRequestException('請輸入寄送地址');
    }

    // 檢查 TradeDesc 是否帶有特殊字元
    const specialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if (specialChars.test(createOrderDto.tradeDesc)) {
      throw new BadRequestException('商品描述勿帶入特殊字元');
    }

    if (!this.utilsService.isValidURL(createOrderDto.returnUrl)) {
      throw new BadRequestException('請檢查ReturnURL');
    }
    return true;
  }

  generateToEcPayParams(createDto: CreateDto) {
    // 訂單編號，不可重複
    const merchantTradeNo: string = 'E001' + moment().format('YYYYMMDDHHmmss');
    const mrchantTradeDate: string = moment().format('YYYY/MM/DD HH:mm:ss');
    const choosePayment: string = 'ALL';

    // ECPay 產生訂單參數
    const params = {
      MerchantID: process.env.MERCHANT_ID,
      MerchantTradeNo: merchantTradeNo,
      MerchantTradeDate: mrchantTradeDate,
      PaymentType: process.env.PAYMENT_TYPE,
      TotalAmount: createDto.totalAmount,
      TradeDesc: createDto.tradeDesc,
      ItemName: createDto.itemName,
      ReturnURL: createDto.returnUrl,
      ChoosePayment: choosePayment,
      EncryptType: process.env.ECNRYPT_TYPE,
    };

    // 產生checkMacValue
    params['CheckMacValue'] = this.utilsService.createCheckMacValue(
      params,
      process.env.HASH_KEY,
      process.env.HASH_IV,
    );

    return params;
  }
}
