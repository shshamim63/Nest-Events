import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, EventResponseDto, UpdateEventDto } from './event.dto';
import { User } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserType } from '@prisma/client';

@Controller('/')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll(): Promise<EventResponseDto[]> {
    return await this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const event = this.eventService.findOne(id);
    return event;
  }

  @Roles(UserType.ADMIN)
  @Post()
  create(@Body() body: CreateEventDto, @User() user) {
    return this.eventService.addEvent(body, user.id);
  }

  @Roles(UserType.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id, @Body() body: UpdateEventDto) {
    return this.eventService.updateEvent(id, body);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id) {
    return this.eventService.remove(id);
  }
}
