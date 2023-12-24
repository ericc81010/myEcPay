import { Module } from '@nestjs/common';
import { WebClientService } from './WebClient.service';

@Module({
  providers: [WebClientService],
  exports: [WebClientService], // 給其他模組使用
})
export class WebClientModule {}
