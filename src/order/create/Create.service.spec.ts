import { Test, TestingModule } from '@nestjs/testing';
import { CreateService } from './Create.service';
import { UtilsService } from 'src/utils/Utils.service';
import { WebClientService } from 'src/webClient/WebClient.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/Order.entity';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');

describe('CreateService', () => {
  let createService: CreateService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderDetail),
          useClass: Repository,
        },
        {
          provide: WebClientService,
          useValue: {
            postForm: jest.fn(),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            createCheckMacValue: jest.fn(),
            isValidURL: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: 'ECPAY_CONFIG',
          useValue: {
            merchantId: '3002607',
            paymentType: 'aio',
            encryptType: '1',
            hashKey: '5294y06JbISpM5x9',
            hashIV: 'v77hoKGq4kWxNNIS',
            ecpayCreateUrl:
              'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
          },
        },
      ],
    }).compile();

    createService = module.get<CreateService>(CreateService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  it('should be defined createService', () => {
    expect(createService).toBeDefined();
  });

  it('should be defined utilsService', () => {
    expect(utilsService).toBeDefined();
  });

  it('should be BadRequestException', async () => {
    const createDto = {
      // 無效的 CreateOrderDto data
      merchantID: '3002607',
      merchantTradeNo: 'ecpay20230312153023123456',
      merchantTradeDate: '2023/03/12 15:30:23',
      paymentType: 'aio',
      totalAmount: 30000,
      tradeDesc: '促銷方案!@#-=|~^&', //帶入特殊字元
      itemName: 'Apple iphone 15',
      returnUrl: 'https://www.ecpay.com.tw/receive.php',
      choosePayment: 'ALL',
      encryptType: 1,
      memberId: 'M01',
      memberName: '會員姓名',
      memberPhone: '會員聯絡方式',
      sendAddress: '寄送地址',
      status: '建單中',
      memo: '',
    };

    await expect(createService.doCreate(createDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should be create order', async () => {
    const createDto = {
      // 有效 CreateOrderDto data
      merchantID: '3002607',
      merchantTradeNo: 'ecpay20230312153023',
      merchantTradeDate: '2023/03/12 15:30:23',
      paymentType: 'aio',
      totalAmount: 30000,
      tradeDesc: '促銷方案',
      itemName: 'Apple iphone 15',
      returnUrl: 'https://www.ecpay.com.tw/receive.php',
      choosePayment: 'ALL',
      encryptType: 1,
      memberId: 'M01',
      memberName: '會員姓名',
      memberPhone: '會員聯絡方式',
      sendAddress: '寄送地址',
      status: '建單中',
      memo: '',
    };

    const axiosPostSpy = jest.spyOn(axios, 'post');
    axiosPostSpy.mockResolvedValue({
      data: '6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840',
    });

    const result = await createService.doCreate(createDto);

    expect(result).toBeInstanceOf(Object);
  });
});
