import { Injectable } from '@nestjs/common';
import { EventResponseDto } from './event.dto';
import { StallService } from 'src/stall/stall.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateEventParams {
  name: string;
  address: string;
  description: string;
  creator_id: number;
  when: string;
}

@Injectable()
export class EventService {
  private readonly events = [];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly stallService: StallService,
  ) {}

  async addEvent({ name, address, when, description }: CreateEventParams) {
    const event = await this.prismaService.event.create({
      data: {
        name: name,
        address: address,
        when: new Date(when),
        description: description,
        creator_id: 1,
      },
    });
    return new EventResponseDto(event);
  }

  remove(id) {
    this.events.filter((event) => event.id !== id);
  }

  async findAll(): Promise<EventResponseDto[]> {
    return (
      await this.prismaService.event.findMany({
        select: {
          id: true,
          name: true,
          address: true,
          description: true,
          when: true,
          stalls: {
            select: {
              name: true,
            },
          },
        },
      })
    ).map((event) => new EventResponseDto(event));
  }

  async findOne(id: number) {
    const event = await this.prismaService.event.findFirst({ where: { id } });
    return new EventResponseDto(event);
  }

  updateEvent(id, input) {
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
