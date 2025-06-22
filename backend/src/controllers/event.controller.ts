import { deleteEventService, getPublicEventsByUsernameAndSlugService } from './../services/event.service'
import { UserNameAndSlugDTO, UserNameDTO } from './../database/dto/event.dto'
import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { CreateEventDto, EventIdDTO } from '../database/dto/event.dto'
import { HTTPSTATUS } from '../config/http.config'
import { Request, Response } from 'express'
import {
  createEventService,
  getPublicEventsByUsernameService,
  getUserEventService,
  toggleEventPrivacyService
} from '../services/event.service'
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

export const toggleEventPrivacyController = asyncHandlerAndValidation(
  EventIdDTO,
  'body',
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id
    const event = await toggleEventPrivacyService(eventIdDto.eventId, userId || '')
    return res.status(HTTPSTATUS.OK).json({
      message: `Event set to ${event.isPrivate ? 'private' : 'public'} successfully`
    })
  }
)

export const getPublicEventsByUsernameController = asyncHandlerAndValidation(
  UserNameDTO,
  'params',
  async (req: Request, res: Response, userNameDTO) => {
    const { user, events } = await getPublicEventsByUsernameService(userNameDTO.username)
    return res.status(HTTPSTATUS.OK).json({
      messasge: 'Public events fetched successfully',
      user,
      events
    })
  }
)

export const getPublicEventsByUsernameAndSlugController = asyncHandlerAndValidation(
  UserNameAndSlugDTO,
  'params',
  async (req: Request, res: Response, userNameAndSlugDTO) => {
    const event = await getPublicEventsByUsernameAndSlugService(userNameAndSlugDTO)
    return res.status(HTTPSTATUS.OK).json({
      message: 'Event details fetched successfully',
      event
    })
  }
)

export const deleteEventController = asyncHandlerAndValidation(
  EventIdDTO,
  'params',
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id as string
    await deleteEventService(userId, eventIdDto.eventId)
    return res.status(HTTPSTATUS.OK).json({
      message: 'Event deleted successfully'
    })
  }
)
