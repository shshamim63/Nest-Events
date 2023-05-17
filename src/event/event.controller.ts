import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, EventResponseDto, UpdateEventDto } from './event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(): Promise<EventResponseDto[]> {
    return await this.eventService.findAll();
  }

  @Get(':id/stalls')
  getEventsStalls(@Param('id', ParseIntPipe) id: string) {
    return this.eventService.getEventStall(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const event = this.eventService.findOne(id);
    return event;
  }

  @Post()
  create(@Body() body: CreateEventDto) {
    return this.eventService.addEvent(body);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id, @Body() body: UpdateEventDto) {
    return this.eventService.updateEvent(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id) {
    return this.eventService.remove(id);
  }
}
