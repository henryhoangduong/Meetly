import { stringToBytes } from 'uuid/dist/cjs/v35'
import { AppDataSource } from '../config/database.config'
import { User } from '../database/entities/user.entity'
import { NotFoundException } from '../utils/app-error'
import { Availability } from '../database/entities/availability.entity'
import { AvailabilityResponseType } from '../@types/availability.type'

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
