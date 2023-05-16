import { Module } from '@nestjs/common';
import { StallController } from './stall.controller';
import { StallService } from './stall.service';

@Module({
  controllers: [StallController],
  providers: [StallService],
  exports: [StallService],
})
export class StallModule {}
