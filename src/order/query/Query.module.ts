import { Module } from '@nestjs/common';
import { QueryController } from './Query.controller';
import { QueryService } from './Query.service';
import { ConfigModule } from '@nestjs/config';
import { WebClientService } from 'src/webClient/WebClient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/Order.entity';
import { OrderDetail } from '../entities/OrderDetail.entity';
import { UtilsModule } from 'src/utils/Utils.module';

@Module({
  imports: [
    // HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([Order, OrderDetail]),
    UtilsModule,
  ],
  controllers: [QueryController],
  providers: [QueryService, WebClientService],
})
export class QueryModule {}
