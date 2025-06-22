import { AppDataSource } from '../config/database.config'
import { CreateEventDto, UserNameAndSlugDTO } from '../database/dto/event.dto'
import { Event, EventLocationEnumType } from '../database/entities/event.entity'
import { User } from '../database/entities/user.entity'
import { BadRequestException, NotFoundException } from '../utils/app-error'
import { slugify } from '../utils/helper'

const createEventService = async (userId: string, createEventDto: CreateEventDto) => {
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

const getUserEventService = async (userId: string) => {
  const userRepository = await AppDataSource.getRepository(User)
  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.events', 'event')
    .loadRelationCountAndMap('event._count.meetings', 'event.meetings')
    .where('user.id=:id', { id: userId })
    .orderBy('event.createdAt', 'DESC')
    .getOne()
  return {
    events: user?.events,
    username: user?.username
  }
}

const toggleEventPrivacyService = async (eventId: string, userId: string) => {
  const eventRepostory = await AppDataSource.getRepository(Event)

  const event = await eventRepostory.findOne({
    where: {
      id: eventId,
      user: { id: userId }
    }
  })
  if (!event) {
    throw new NotFoundException('Event not found')
  }
  event.isPrivate = !event.isPrivate
  await eventRepostory.save(event)
  return event
}

const getPublicEventsByUsernameService = async (userName: string) => {
  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.events', 'event', 'event.isPrivate = :isPrivate', { isPrivate: false })
    .where('user.username = :username', { userName })
    .select(['user.id', 'user.name', 'user.imageUrl'])
    .addSelect(['event.id', 'event.title', 'event.description', 'event.slug', 'event.duration'])
    .orderBy('event.createdAt', 'DESC')
    .getOne()
  if (!user) {
    throw new NotFoundException('User not found')
  }
  return {
    user: {
      name: user.name,
      username: user.username,
      imageUrl: user.imageUrl
    },
    events: user.events
  }
}

const getPublicEventsByUsernameAndSlugService = async (userNameAndSlugDto: UserNameAndSlugDTO) => {
  const { username, slug } = userNameAndSlugDto
  const eventRepository = AppDataSource.getRepository(Event)
  const event = await eventRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.user', 'user')
    .where('user.username = :username', { username })
    .andWhere('event.slug = :slug', { slug })
    .andWhere('event.isPrivate = :isPrivate', { isPrivate: false })
    .select(['event.id', 'event.title', 'event.description', 'event.slug', 'event.duration', 'event.locationType'])
    .addSelect(['user.id', 'user.name', 'user.imageUrl'])
    .getOne()
  return event
}

const deleteEventService = async (userId: string, eventId: string) => {
  const eventRepository = AppDataSource.getRepository(Event)
  const event = await eventRepository.findOne({
    where: { id: eventId, user: { id: userId } }
  })
  if (!event) {
    throw new NotFoundException('Event not found')
  }
  await eventRepository.remove(event)
  return { success: true }
}

export {
  deleteEventService,
  createEventService,
  getUserEventService,
  toggleEventPrivacyService,
  getPublicEventsByUsernameService,
  getPublicEventsByUsernameAndSlugService
}
