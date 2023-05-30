import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventStallModule } from 'src/event-stall/event-stall.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, EventStallModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
