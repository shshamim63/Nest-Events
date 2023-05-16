import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { EventResponseDto } from './event.dto';
import { StallService } from 'src/stall/stall.service';

@Injectable()
export class EventService {
  private readonly events = [];

  constructor(private readonly stallService: StallService) {}

  addEvent(input): EventResponseDto {
    const newEvent = {
      ...input,
      id: uuid(),
      when: new Date(input.when),
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.events.push(newEvent);
    return new EventResponseDto(newEvent);
  }

  remove(id) {
    this.events.filter((event) => event.id !== id);
  }

  findAll(): EventResponseDto[] {
    return this.events.map((event) => new EventResponseDto(event));
  }

  findOne(id: string): EventResponseDto {
    const event = this.events.find((event) => event.id === id);
    return new EventResponseDto(event);
  }

  updateEvent(id, input): EventResponseDto {
    const index = this.events.findIndex((event) => event.id === id);
    const updatedEvent = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
      updated_at: new Date(),
    };
    this.events[index] = updatedEvent;
    return new EventResponseDto(updatedEvent);
  }

  getEventStall(id) {
    const currentEvent = this.events.find((event) => event.id === id);
    if (!currentEvent) return;
    return this.stallService.getStalls(id);
  }
}
