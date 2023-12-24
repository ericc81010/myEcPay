import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Order } from './Order.entity';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number; // 明细ID

  @Column('varchar', { name: 'item_name', length: 400, default: '' })
  itemName: string; //  商品名稱

  @Column({ nullable: true, name: 'quantity' })
  quantity: number; // 商品數量

  @Column({ name: 'total_amount' })
  totalAmount: number; //訂單總金額

  @ManyToOne(() => Order, (order) => order.order_details)
  @JoinColumn({ name: 'merchant_trade_no' })
  order: Order; // 關聯的訂單
}
