import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { DatabaseService } from './database.service';

initializeTransactionalContext(); // ap啟動時調用

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // TypeORM 會自動同步資料庫結構與實體定義，開發環境中才會使用
      // logging: true,
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
