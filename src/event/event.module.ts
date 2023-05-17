import { Module } from '@nestjs/common';
import { EventsController } from './event.controller';
import { EventService } from './event.service';
import { StallModule } from 'src/stall/stall.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, StallModule],
  controllers: [EventsController],
  providers: [EventService],
})
export class EventModule {}
