import { AppDataSource } from '../config/database.config'
import { User } from '../database/entities/user.entity'
import { NotFoundException } from '../utils/app-error'
import { Availability } from '../database/entities/availability.entity'
import { AvailabilityResponseType } from '../@types/availability.type'
import { UpdateAvailabilityDto } from '../database/dto/availability.dto'
import { DayOfWeekEnum } from '../database/entities/day-availability.entity'

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
