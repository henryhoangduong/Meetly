import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { CreateEventDto } from '../database/dto/event.dto'
import { HTTPSTATUS } from '../config/http.config'
import { Request, Response } from 'express'
import { createEventService } from '../services/event.service'

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
