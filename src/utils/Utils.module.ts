import { Module } from '@nestjs/common';
import { UtilsService } from './Utils.service';

@Module({
  providers: [UtilsService],
  exports: [UtilsService], // 給其他模組使用
})
export class UtilsModule {}
