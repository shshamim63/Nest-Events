import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class EventResponseDto {
  id: number;
  name: string;
  address: string;
  description: string;
  when: Date;

  @Expose({ name: 'createdAt' })
  transformCreatedAt() {
    return this.created_at;
  }

  @Expose({ name: 'updatedAt' })
  transformUpdatedAt() {
    return this.updated_at;
  }

  @Expose({ name: 'creatorId' })
  transformCreatorId() {
    return this.creator_id;
  }

  @Exclude()
  created_at: Date;

  @Exclude()
  creator_id: number;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<EventResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  when: string;
}

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  when?: string;

  @IsNumber()
  @IsOptional()
  creator_id?: number;
}
