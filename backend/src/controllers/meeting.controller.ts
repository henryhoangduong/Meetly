import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { MeetingFilterEnum, MeetingFilterEnumType } from '../enums/meeting.enum'
import { getUserMeetingsService } from '../services/meeting.service'

export const getUserMeetingsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const filter = (req.query.filter as MeetingFilterEnumType) || MeetingFilterEnum.UPCOMING
  const meetings = getUserMeetingsService(userId || '', filter)
  return res.status(HTTPSTATUS.OK).json({
    message: 'Meeting fetched successfully',
    meetings
  })
})
