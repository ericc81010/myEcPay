import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateModule } from './order/create/Create.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsService } from './utils/Utils.service';
import { QueryModule } from './order/query/Query.module';
import { DatabaseModule } from './database/database.module';
import { WebClientService } from './webClient/WebClient.service';
import { UtilsModule } from './utils/Utils.module';

@Module({
  imports: [
    CreateModule,
    QueryModule,
    ConfigModule.forRoot({
      isGlobal: true, //全域都可以用
    }),
    DatabaseModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UtilsService, WebClientService],
})
export class AppModule {}
