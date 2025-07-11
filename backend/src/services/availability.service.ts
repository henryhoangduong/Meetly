import { AppDataSource } from '../config/database.config'
import { User } from '../database/entities/user.entity'
import { NotFoundException } from '../utils/app-error'
import { Availability } from '../database/entities/availability.entity'
import { AvailabilityResponseType } from '../@types/availability.type'
import { UpdateAvailabilityDto } from '../database/dto/availability.dto'
import { DayOfWeekEnum } from '../database/entities/day-availability.entity'
import { Event } from '../database/entities/event.entity'
import { addDays, addMinutes, format, formatDate, isToday, nextDay, parseISO } from 'date-fns'

export const getUserAvailabilityService = async (userId: string) => {
  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['availability', 'availability.days']
  })
  if (!user || !user.availability) {
    throw new NotFoundException('User not found or availability')
  }
  const availabilityData: AvailabilityResponseType = {
    timeGap: user.availability.timeGap,
    days: []
  }
  user.availability.days.forEach((dayAvailability) => {
    availabilityData.days.push({
      day: dayAvailability.day,
      startTime: dayAvailability.startTime.toISOString().slice(11, 16),
      endTime: dayAvailability.endTime.toISOString().slice(11, 16),
      isAvailable: dayAvailability.isAvailable
    })
  })
}

export const updateAvailabilityService = async (userId: string, data: UpdateAvailabilityDto) => {
  const userRepository = AppDataSource.getRepository(User)
  const availabilityRepository = AppDataSource.getRepository(Availability)

  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['availability', 'availability.days']
  })
  if (!user) throw new NotFoundException('User not found')
  const dayAvailabilityData = data.days.map(({ day, isAvailable, startTime, endTime }) => {
    const baseDate = new Date().toISOString().split('T')[0]
    return {
      day: day.toUpperCase() as DayOfWeekEnum,
      startTime: new Date(`${baseDate}T${startTime}:00Z`),
      endTime: new Date(`${baseDate}T${endTime}:00Z`),
      isAvailable
    }
  })

  if (user.availability) {
    await availabilityRepository.save({
      id: user.availability.id,
      timeGap: data.timeGap,
      days: dayAvailabilityData.map((day) => ({
        ...day,
        availability: { id: user.availability.id }
      }))
    })
  }

  return { sucess: true }
}

export const getAvailabilityForPublicEventService = async (eventId: string) => {
  const eventRepository = AppDataSource.getRepository(Event)
  const event = await eventRepository.findOne({
    where: { id: eventId, isPrivate: false },
    relations: ['user', 'user.availability', 'user.availability.days', 'user.meetings']
  })
  if (!event || !event.user.availability) return []
  const { availability, meetings } = event.user
  const daysOfWeek = Object.values(DayOfWeekEnum)
  const availabileDays = []
  for (const dayOfWeek of daysOfWeek) {
    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek)
    const nextDate = generateNextDateForDay(dayOfWeek)
    if (dayAvailability) {
      const slots = dayAvailability.isAvailable
        ? generateAvailableTimeSlots(
            dayAvailability.startTime,
            dayAvailability.endTime,
            event.duration,
            meetings,
            format(nextDate, 'yyyy-MM-dd'),
            availability.timeGap
          )
        : []
      availabileDays.push({
        day: dayOfWeek,
        slots,
        isAvailable: dayAvailability.isAvailable
      })
    }
  }
  return availabileDays
}

const generateNextDateForDay = (dayOfWeek: string): Date => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const today = new Date()
  const todayDay = today.getDay()
  const targetDay = days.indexOf(dayOfWeek)
  const daysUntilTarget = (targetDay - todayDay + 7) % 7
  return addDays(today, daysUntilTarget)
}

function generateAvailableTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number,
  meetings: { startTime: Date; endTime: Date }[],
  dateStr: string,
  timeGap: number = 30
) {
  const slots = []
  let slotStartTime = parseISO(`${dateStr}T${startTime.toISOString().slice(11, 16)}`)
  const slotEndTime = parseISO(`${dateStr}T${endTime.toISOString().slice(11, 16)}`)
  const now = new Date()
  while (slotStartTime < slotEndTime) {
    if (!isToday || slotStartTime >= now) {
      const slotEnd = new Date(slotStartTime.getTime() + duration * 60000)
      if (isSlotAvailable(slotStartTime, slotEnd, meetings)) {
        slots.push(format(slotStartTime, 'HH:mm'))
      }
    }
    slotStartTime = addMinutes(slotStartTime, timeGap)
  }
  return slots
}

function isSlotAvailable(slotStart: Date, slotEnd: Date, meetings: { startTime: Date; endTime: Date }[]): boolean {
  for (const meeting of meetings) {
    if (slotStart < meeting.endTime && slotEnd > meeting.startTime) {
      return false
    }
  }
  return true
}
