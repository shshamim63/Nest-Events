import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StallResponseDto {
  name: string;
  operator_id: number;
  event_id: number;
  length: number;
  width: number;
  floor: number;
  stall_number: number;

  @Expose({ name: 'eventId' })
  transformEventId() {
    return this.event_id;
  }

  @Expose({ name: 'stallNumber' })
  transformStallNumber() {
    return this.stall_number;
  }

  @Expose({ name: 'operatorId' })
  transformOperatorId() {
    return this.operator_id;
  }

  constructor(partial: Partial<StallResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CreateStallDto {
  @IsString()
  name: string;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsNumber()
  floor: number;

  @IsOptional()
  @IsNumber()
  operatorId: number;
}
