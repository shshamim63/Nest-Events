import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventResponseDto } from './event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateEventParams {
  name: string;
  address: string;
  description: string;
  when: string;
}

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async addEvent(
    { name, address, when, description }: CreateEventParams,
    userId: number,
  ) {
    try {
      const event = await this.prismaService.event.create({
        data: {
          name: name,
          address: address,
          when: new Date(when),
          description: description,
          creator_id: userId,
        },
      });
      return new EventResponseDto(event);
    } catch (error) {
      throw new InternalServerErrorException(
        'Server could not complete operation',
      );
    }
  }

  async remove(id: number) {
    await this.prismaService.stall.deleteMany({
      where: {
        event_id: id,
      },
    });

    await this.prismaService.event.delete({
      where: {
        id,
      },
    });
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

  async updateEvent(id: number, data: Partial<CreateEventParams>) {
    const currentEvent = await this.prismaService.event.findUnique({
      where: { id },
    });

    if (!currentEvent) throw new NotFoundException();

    const updatedEvent = await this.prismaService.event.update({
      where: {
        id,
      },
      data,
    });

    return new EventResponseDto(updatedEvent);
  }
}
