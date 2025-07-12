import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { MeetingFilterEnum, MeetingFilterEnumType } from '../enums/meeting.enum'
import {
  cancelMeetingService,
  createMeetingBookingForGuestService,
  getUserMeetingsService
} from '../services/meeting.service'
import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { CreateMeetingDto, MeetingIdDTO } from '../database/dto/meeting.dto'

export const getUserMeetingsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const filter = (req.query.filter as MeetingFilterEnumType) || MeetingFilterEnum.UPCOMING
  const meetings = getUserMeetingsService(userId || '', filter)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Meeting fetched successfully',
    meetings
  })
})

export const createMeetingBookingForGuestController = asyncHandlerAndValidation(
  CreateMeetingDto,
  'body',
  async (req: Request, res: Response, createMeetingDto) => {
    const { meetingLink, meeting } = await createMeetingBookingForGuestService(createMeetingDto)
    return res.status(HTTPSTATUS.OK).json({
      message: 'Meeting scheduled successfully',
      data: {
        meetingLink,
        meeting
      }
    })
  }
)

export const cancelMeetingController = asyncHandlerAndValidation(
  MeetingIdDTO,
  'params',
  async (req: Request, res: Response, meetingIdDto) => {
    await cancelMeetingService(meetingIdDto.meetingId)

    return res.status(HTTPSTATUS.OK).json({
      messsage: 'Meeting cancelled successfully'
    })
  }
)
