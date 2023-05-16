import { Expose } from 'class-transformer';

export class StallResponseDto {
  name: string;
  owner: string;
  event_id: string;
  stall_number: number;

  @Expose({ name: 'eventId' })
  transformEventId() {
    return this.event_id;
  }

  @Expose({ name: 'stallNumber' })
  transformStallNumber() {
    return this.stall_number;
  }

  constructor(partial: Partial<StallResponseDto>) {
    Object.assign(this, partial);
  }
}
