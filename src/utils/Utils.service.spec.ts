import { UtilsService } from './Utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    service = new UtilsService();
  });

  describe('createCheckMacValue', () => {
    it('createCheckMacValue correctly', () => {
      const hashKeyTest = 'pwFHCqoQZGmho4w6';
      const hashIVTest = 'EkRm7iFT261dpevs';

      const payloadTest = {
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
      };

      const checkMacValue = service.createCheckMacValue(
        payloadTest,
        hashKeyTest,
        hashIVTest,
      );

      expect(checkMacValue).toBe(
        '6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840',
      );
    });
  });
});
