import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { OrderDetail } from './OrderDetail.entity';

@Entity('order')
export class Order {
  @PrimaryColumn({ name: 'merchant_trade_no' })
  merchantTradeNo: string; // 特店訂單編號均為唯一值，不可重複使用, 英數字大小寫混合

  @Column('varchar', { name: 'member_id', length: 10, default: '' })
  memberId: string; //會員ID

  @Column('varchar', { name: 'member_name', length: 20, default: '' })
  memberName: string; //  會員姓名

  @Column('varchar', { name: 'member_phone', length: 10, default: '' })
  memberPhone: string; //  會員聯絡電話

  @Column('varchar', { name: 'send_address', length: 100, default: '' })
  sendAddress: string; //  寄送地址

  @Column('varchar', { name: 'merchant_trade_date' })
  merchantTradeDate: string; // 特店交易時間 String(20) 格式為：yyyy/MM/dd HH:mm:ss

  @Column('varchar', { name: 'trade_desc', length: 200, default: '' })
  tradeDesc: string; //  交易描述 String(200)

  @Column({ name: 'status' })
  status: string; //訂單狀態

  @Column({ name: 'return_url' })
  returnUrl: string; //  付款完成通知回傳網址 String(200)

  @Column({ name: 'choose_payment' })
  choosePayment: string; // 選擇預設付款方式 String(20)

  @Column({ name: 'check_mac_value' })
  checkMacValue?: string; //檢查碼

  @Column({ nullable: true, name: 'update_date' })
  updateDate?: string; //更新時間

  @Column({ nullable: true, name: 'memo' })
  memo: string; //備註

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  order_details: OrderDetail[]; // 訂單明細
}
