import { Injectable } from '@nestjs/common';
import { StallResponseDto } from 'src/event-stall/event-stall.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StallService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStall(stallId: number) {
    const stall = await this.prismaService.stall.findUnique({
      where: { id: stallId },
    });
    return new StallResponseDto(stall);
  }
}
