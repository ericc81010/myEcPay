import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  merchantTradeNo: string; // 特店訂單編號均為唯一值，不可重複使用, 英數字大小寫混合

  @IsNotEmpty()
  @IsString()
  merchantID: string; // 特店編號(綠界提供)

  @IsNotEmpty()
  @IsString()
  merchantTradeDate: string; // 特店交易時間 String(20) 格式為：yyyy/MM/dd HH:mm:ss

  @IsNotEmpty()
  @IsString()
  paymentType: string; // 交易類型 String(20) 請固定填入 aio

  @IsNotEmpty()
  @IsInt()
  totalAmount: number; // 交易金額

  @IsNotEmpty()
  @IsString()
  tradeDesc: string; //  交易描述 String(200)

  @IsNotEmpty()
  @IsString()
  itemName: string; //  商品名稱 String(400)

  @IsNotEmpty()
  @IsString()
  returnUrl: string; //  付款完成通知回傳網址 String(200)

  @IsNotEmpty()
  @IsString()
  choosePayment: string; // 選擇預設付款方式 String(20)

  @IsNotEmpty()
  @IsInt()
  encryptType: number; //  CheckMacValue 加密類型 Int 使用 SHA256 加密, 請固定填入1，使用SHA256加密

  @IsString()
  checkMacValue?: string; //檢查碼

  @IsString()
  memberId: string; //會員ID

  @IsString()
  memberName: string; //  會員姓名

  @IsString()
  memberPhone: string; //  會員聯絡方式

  @IsString()
  sendAddress: string; //  寄送地址

  @IsString()
  status: string; //訂單狀態

  @IsString()
  memo: string; //備註
}
