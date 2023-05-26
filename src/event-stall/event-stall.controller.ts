import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EventStallService } from './event-stall.service';
import {
  CreateStallDto,
  StallResponseDto,
  UpdateStallDto,
} from './event-stall.dto';
import { Roles } from 'src/decorators/role.decorator';
import { UserType } from '@prisma/client';
import { User } from 'src/user/decorators/user.decorator';

@Controller('')
export class EventStallController {
  constructor(private readonly eventStallService: EventStallService) {}

  @Roles(UserType.ADMIN)
  @Post()
  createStall(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() body: CreateStallDto,
    @User() user,
  ): Promise<StallResponseDto> {
    return this.eventStallService.createStall(eventId, body, user.id);
  }

  @Roles(UserType.ADMIN, UserType.OPERATOR)
  @Get()
  getStalls(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<StallResponseDto[]> {
    return this.eventStallService.getStalls(eventId);
  }

  @Roles(UserType.ADMIN)
  @Patch(':id')
  updateStall(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStallDto,
  ): Promise<StallResponseDto> {
    return this.eventStallService.updateStall(eventId, id, body);
  }

  @Roles(UserType.ADMIN)
  @Patch('/:id/unallocate')
  unallocateStall(@Param('id', ParseIntPipe) id: number, @User() user) {
    return this.eventStallService.unallocateStall(id, user.id);
  }
}
