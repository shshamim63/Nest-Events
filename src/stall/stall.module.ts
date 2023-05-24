import { Module } from '@nestjs/common';
import { StallController } from './stall.controller';
import { StallService } from './stall.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StallController],
  providers: [StallService],
})
export class StallModule {}
