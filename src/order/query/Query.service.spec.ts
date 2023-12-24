import { Test, TestingModule } from '@nestjs/testing';
import { QueryService } from './Query.service';
import { UtilsService } from 'src/utils/Utils.service';
import { WebClientService } from 'src/webClient/WebClient.service';
import { Repository } from 'typeorm';
import { Order } from '../entities/Order.entity';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { QueryDto } from './Query.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('QueryService', () => {
  let service: QueryService;
  // let utilsService: UtilsService;
  let webClientService: WebClientService;
  // let orderRepository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        {
          provide: Repository,
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]), // 預設返回空陣列
            }),
          },
        },
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
            getTimestamp: jest.fn(),
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

    service = module.get<QueryService>(QueryService);
    webClientService = module.get<WebClientService>(WebClientService);
    // orderRepository = module.get<Repository<Order>>(Repository);
    // utilsService = module.get<UtilsService>(UtilsService);
  });

  it('should be query DB', async () => {
    // 模擬 findOrders 返回有訂單
    jest.spyOn(service, 'findOrders').mockResolvedValue([new Order()]);

    const queryDto = new QueryDto(); // 適當設置 QueryDto
    const result = await service.doQuery(queryDto);

    expect(result).toBeDefined();
    expect(result.success).toBeTruthy();
  });

  it('should be call EcPay Api', async () => {
    // 模擬 findOrders 返回空陣列
    jest.spyOn(service, 'findOrders').mockResolvedValue([]);

    // 模擬ecPay API 返回資料
    jest.spyOn(webClientService, 'postForm').mockResolvedValue({
      data: 'CustomField1=&CustomField2=&CustomField3=&CustomField4=&HandlingCharge=0&ItemName=iphone20&MerchantID=2000132&MerchantTradeNo=E00120231119143444&PaymentDate=&PaymentType=&PaymentTypeChargeFee=0&StoreID=&TradeAmt=9999&TradeDate=2023/11/19 14:34:44&TradeNo=2311191434448588&TradeStatus=0&CheckMacValue=7E354ED0459C1B7B9884AC56E33C0E0321C5AA99D5D7B217E6D0AB0AD8C86164',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    });

    const queryDto = {
      merchantID: '3002607',
      merchantTradeNo: 'E00120231119143444',
      memberId: 'M01',
    };

    const result = await service.doQuery(queryDto);
    expect(result).toBeDefined();
    expect(webClientService.postForm).toHaveBeenCalled();
  });
});
