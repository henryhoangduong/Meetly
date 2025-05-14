import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { CreateEventDto } from '../database/dto/event.dto'
import { HTTPSTATUS } from '../config/http.config'
import { Request, Response } from 'express'
import { createEventService, getUserEventService } from '../services/event.service'
import { asyncHandler } from '../middleware/asyncHandler.middleware'

export const createEventController = asyncHandlerAndValidation(
  CreateEventDto,
  'body',
  async (req: Request, res: Response, createEventDto) => {
    const userId = req.user?.id
    const event = await createEventService(userId || '', createEventDto)
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'Event created',
      event
    })
  }
)

export const getUserEventsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const { events, username } = await getUserEventService(userId || '')
  return res.status(HTTPSTATUS.OK).json({
    message: 'User event fetched successfully',
    data: {
      events,
      username
    }
  })
})
