import { Module } from '@nestjs/common';
import { CreateOrderController } from './Create.controller';
import { CreateService } from './Create.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/Order.entity';
import { WebClientService } from 'src/webClient/WebClient.service';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { UtilsModule } from 'src/utils/Utils.module';

@Module({
  imports: [
    UtilsModule,
    ConfigModule,
    TypeOrmModule.forFeature([Order, OrderDetail]),
  ],
  controllers: [CreateOrderController],
  providers: [CreateService, WebClientService],
})
export class CreateModule {}
