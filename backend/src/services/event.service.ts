import { AppDataSource } from '../config/database.config'
import { CreateEventDto } from '../database/dto/event.dto'
import { Event, EventLocationEnumType } from '../database/entities/event.entity'
import { User } from '../database/entities/user.entity'
import { BadRequestException, NotFoundException } from '../utils/app-error'
import { slugify } from '../utils/helper'

export const createEventService = async (userId: string, createEventDto: CreateEventDto) => {
  console.log('createEventDto: ', createEventDto)
  const userRepository = await AppDataSource.getRepository(User)
  const eventRepostory = await AppDataSource.getRepository(Event)
  if (!Object.values(EventLocationEnumType).includes(createEventDto.locationType)) {
    throw new BadRequestException('Invalid location type')
  }
  const user = await userRepository.findOne({
    where: {
      id: userId
    }
  })
  if (!user) {
    throw new NotFoundException('User not found')
  }
  const slug = slugify(createEventDto.title)
  const event = eventRepostory.create({ ...createEventDto, slug, user: { id: userId } })
  await eventRepostory.save(event)
  return event
}
