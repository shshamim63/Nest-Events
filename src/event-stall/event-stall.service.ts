import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { StallResponseDto } from './event-stall.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateStallParams {
  name: string;
  length: number;
  width: number;
  floor: number;
  operatorId: number;
}

interface UpdateStallParams {
  name?: string;
  length?: number;
  width?: number;
  floor?: number;
  updatedEventId?: number;
}
interface UserInfo {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone: string;
  user_type: string;
}

@Injectable()
export class EventStallService {
  constructor(private readonly prismaService: PrismaService) {}

  async createStall(eventId: number, body: CreateStallParams, userId: number) {
    const event = await this.prismaService.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) throw new NotFoundException('Event does not exist');

    let operator: UserInfo;
    if (body.operatorId) {
      operator = await this.prismaService.user.findUnique({
        where: { id: body.operatorId },
      });

      if (!operator)
        throw new NotAcceptableException('Operator does not exist');
    }

    const data = {
      name: body.name,
      length: body.length,
      width: body.width,
      floor: body.floor,
      event_id: event.id,
      operator_id: operator ? operator.id : userId,
      ...(operator && { occupied: true }),
    };

    const stall = await this.prismaService.stall.create({
      data: data,
    });

    return new StallResponseDto(stall);
  }

  async getStalls(eventId: number) {
    return (
      await this.prismaService.stall.findMany({
        where: {
          event_id: eventId,
        },
      })
    ).map((stall) => new StallResponseDto(stall));
  }

  async unallocateStall(id, userId: number) {
    const data = {
      operator_id: userId,
      occufied: false,
    };

    const unallocateStall = await this.prismaService.stall.update({
      where: { id: id },
      data: data,
    });

    return new StallResponseDto(unallocateStall);
  }

  async updateStall(eventId: number, id, body: UpdateStallParams) {
    if (body.updatedEventId && body.updatedEventId !== eventId) {
      const updatedEvent = this.prismaService.event.findUnique({
        where: { id: eventId },
      });
      if (!updatedEvent)
        throw new NotFoundException('Updated event does not exist');
    }

    const data = {
      ...(body.name && { name: body.name }),
      ...(body.floor && { floor: body.floor }),
      ...(body.length && { length: body.length }),
      ...(body.width && { widt: body.width }),
      ...(body.updatedEventId && { event_id: body.updatedEventId }),
      ...(body.updatedEventId && { occupied: true }),
    };

    const updatedStall = await this.prismaService.stall.update({
      where: { id: id },
      data: data,
    });
    return new StallResponseDto(updatedStall);
  }
}
