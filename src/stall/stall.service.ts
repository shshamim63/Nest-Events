import { Injectable } from '@nestjs/common';
import { StallResponseDto } from './stall.dto';

@Injectable()
export class StallService {
  private readonly stalls = [];
  getStalls(id = null) {
    if (id) {
      return this.stalls
        .filter((stall) => stall.event_id === id)
        .map((stall) => new StallResponseDto(stall));
    } else {
      return this.stalls.map((stall) => new StallResponseDto(stall));
    }
  }
}
