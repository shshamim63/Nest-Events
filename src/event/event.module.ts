import { Module } from '@nestjs/common';
import { EventsController } from './event.controller';
import { EventService } from './event.service';
import { EventStallModule } from 'src/event-stall/event-stall.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, EventStallModule],
  controllers: [EventsController],
  providers: [EventService],
})
export class EventModule {}
