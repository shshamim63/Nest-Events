import { Module } from '@nestjs/common';
import { EventsController } from './event.controller';
import { EventService } from './event.service';
import { StallModule } from 'src/stall/stall.module';

@Module({
  imports: [StallModule],
  controllers: [EventsController],
  providers: [EventService],
})
export class EventModule {}
