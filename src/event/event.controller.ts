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
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, EventResponseDto, UpdateEventDto } from './event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll(): EventResponseDto[] {
    return this.eventService.findAll();
  }

  @Get(':id/stalls')
  getEventsStalls(@Param('id') id: string) {
    return this.eventService.getEventStall(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const event = this.eventService.findOne(id);
    return event;
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return this.eventService.addEvent(input);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id, @Body() input: UpdateEventDto) {
    return this.eventService.updateEvent(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id) {
    return this.eventService.remove(id);
  }
}
