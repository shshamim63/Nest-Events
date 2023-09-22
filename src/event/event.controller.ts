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
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto, EventResponseDto, UpdateEventDto } from './event.dto';
import { User } from 'src/user/decorators/user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { UserType } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Event')
@Controller('/')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'Successfully logged in',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ): Promise<EventResponseDto[]> {
    return await this.eventService.findAll(page, limit);
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
