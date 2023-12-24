import { Test, TestingModule } from '@nestjs/testing';
import { QueryController } from './Query.controller';
import { QueryService } from './Query.service';
import { QueryDto } from './Query.dto';
// import { QueryResponseDto } from './QueryResponse.dto';

describe('QueryController', () => {
  let controller: QueryController;
  let service: QueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueryController],
      providers: [
        {
          provide: QueryService,
          useValue: {
            doQuery: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QueryController>(QueryController);
    service = module.get<QueryService>(QueryService);
  });

  it('確定是否載入service', () => {
    expect(service).toBeDefined();
  });

  it('查詢成功', async () => {
    const queryDto: QueryDto = {
      memberId: '',
      merchantTradeNo: 'E00120231119143444',
      // MerchantID: '',
      // MerchantTradeNo: 'E00120231119143444',
      // TimeStamp: 0,
      // CheckMacValue: '',
    };

    const responseDto = {
      success: true,
      ecPayResponsData:
        'CustomField1=&CustomField2=&CustomField3=&CustomField4=&HandlingCharge=0&ItemName=iphone20&MerchantID=2000132&MerchantTradeNo=E00120231119143444&PaymentDate=&PaymentType=&PaymentTypeChargeFee=0&StoreID=&TradeAmt=9999&TradeDate=2023/11/19 14:34:44&TradeNo=2311191434448588&TradeStatus=0&CheckMacValue=7E354ED0459C1B7B9884AC56E33C0E0321C5AA99D5D7B217E6D0AB0AD8C86164',
    };

    jest.spyOn(service, 'doQuery').mockResolvedValue(responseDto);

    const result = await controller.queryOrder(queryDto);

    expect(result).toEqual(responseDto.ecPayResponsData);
  });

  it('查詢無資料', async () => {
    const queryDto: QueryDto = {
      // merchantID: '',
      merchantTradeNo: 'E00120231119143443',
      memberId: 'M01',
      // timeStamp: 0,
      // checkMacValue: '',
    };

    const responseDto = { success: true, ecPayResponsData: 'No Data Found' };

    jest.spyOn(service, 'doQuery').mockResolvedValue(responseDto);

    const result = await controller.queryOrder(queryDto);

    expect(result).toEqual(responseDto.ecPayResponsData);
  });
});
