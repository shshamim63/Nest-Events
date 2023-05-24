import { Module } from '@nestjs/common';
import { EventStallController } from './event-stall.controller';
import { EventStallService } from './event-stall.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventStallController],
  providers: [EventStallService],
  exports: [EventStallService],
})
export class EventStallModule {}
