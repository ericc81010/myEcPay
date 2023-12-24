import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderController } from './Create.controller';
import { CreateService } from './Create.service';
// import { CreateDto } from './Create.dto';
import { CreateResponseDto } from './CreateResponse.dto';

describe('CreateOrderController', () => {
  let controller: CreateOrderController;
  let service: CreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateOrderController],
      providers: [
        {
          provide: CreateService,
          useValue: {
            doCreate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateOrderController>(CreateOrderController);
    service = module.get<CreateService>(CreateService);
  });

  it('建立訂單失敗時，回傳的訊息', async () => {
    const mockCreateDto = {
      merchantID: '3002607',
      merchantTradeNo: 'ecpay20230312153023',
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

    const mockResponse: CreateResponseDto = {
      success: false,
      merchantTradeNo: 'ecpay20230312153023',
      ecPayResponsData: null,
      msg: '商品描述勿帶入特殊字元',
    };

    jest.spyOn(service, 'doCreate').mockResolvedValue(mockResponse);

    const result = await controller.createOrder(mockCreateDto);

    expect(result).toEqual('商品描述勿帶入特殊字元');
  });
});
