import { IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  memberId: string; // 特店編號(綠界提供)

  @IsString()
  merchantTradeNo: string; // 特店訂單編號均為唯一值，不可重複使用, 英數字大小寫混合
}
