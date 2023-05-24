import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { StallService } from './stall.service';
import { StallResponseDto } from 'src/event-stall/event-stall.dto';

@Controller('stalls')
export class StallController {
  constructor(private readonly stallService: StallService) {}

  @Roles(UserType.ADMIN, UserType.OPERATOR)
  @Get(':id')
  getStall(@Param('id', ParseIntPipe) id: number): Promise<StallResponseDto> {
    return this.stallService.getStall(id);
  }
}
