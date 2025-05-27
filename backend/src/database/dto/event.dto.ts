import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator'
import { EventLocationEnumType } from '../entities/event.entity'

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @IsNotEmpty()
  duration: number

  @IsEnum(EventLocationEnumType)
  @IsNotEmpty()
  locationType: EventLocationEnumType
}

export class EventIdDTO {
  @IsUUID(4, { message: 'Invalid uuid' })
  @IsNotEmpty()
  eventId: string
}
