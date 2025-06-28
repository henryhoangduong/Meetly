import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { getUserAvailabilityService, updateAvailabilityService } from '../services/availability.service'
import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { UpdateAvailabilityDto } from '../database/dto/availability.dto'

export const getUserAvailabilityController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string
  const availability = await getUserAvailabilityService(userId)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Fetch availability successfully',
    availability
  })
})

export const updateAvailabilityController = asyncHandlerAndValidation(
  UpdateAvailabilityDto,
  'body',
  async (req: Request, res: Response, updateAvailabilityDto) => {
    const userId = req.user?.id as string

    await updateAvailabilityService(userId, updateAvailabilityDto)

    return res.status(HTTPSTATUS.OK).json({
      message: 'Availability updated successfully'
    })
  }
)
