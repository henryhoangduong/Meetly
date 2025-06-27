import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { getUserAvailabilityService } from '../services/availability.service'

export const getUserAvailabilityController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id as string
  const availability = await getUserAvailabilityService(userId)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Fetch availability successfully',
    availability
  })
})
