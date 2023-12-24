export class CreateResponseDto {
  success: boolean;
  merchantTradeNo: string;
  msg: string;
  ecPayResponsData?: any;

  constructor(
    success: boolean,
    merchantTradeNo: string,
    msg: string,
    ecPayResponsData?: any,
  ) {
    this.success = success;
    this.merchantTradeNo = merchantTradeNo;
    this.msg = msg;
    this.ecPayResponsData = ecPayResponsData;
  }
}
