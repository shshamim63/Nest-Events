import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StallResponseDto {
  name: string;
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

  @Expose({ name: 'createdAt' })
  transformCreatedAt() {
    return this.created_at;
  }

  @Expose({ name: 'updatedAt' })
  transformUpdatedAt() {
    return this.updated_at;
  }

  @Exclude()
  operator_id: number;

  @Exclude()
  event_id: number;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

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

export class UpdateStallDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  length: number;

  @IsOptional()
  @IsNumber()
  width: number;

  @IsOptional()
  @IsNumber()
  floor: number;

  @IsOptional()
  @IsNumber()
  updatedEventId: number;
}
