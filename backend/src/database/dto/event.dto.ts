import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
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
