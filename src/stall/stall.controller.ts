import { Controller, Get } from '@nestjs/common';
import { StallService } from './stall.service';

@Controller('stalls')
export class StallController {
  constructor(private readonly stallService: StallService) {}

  @Get()
  getStalls() {
    return this.stallService.getStalls();
  }
}
