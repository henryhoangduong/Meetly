import { Router } from 'express'
import { passportJwtAuthenticatJwt } from '../config/passport.config'
import {
  cancelMeetingController,
  createMeetingBookingForGuestController,
  getUserMeetingsController
} from '../controllers/meeting.controller'

export const meetingRoutes = Router()

meetingRoutes.get('/user/all', passportJwtAuthenticatJwt, getUserMeetingsController)
meetingRoutes.post('/public/create', createMeetingBookingForGuestController)
meetingRoutes.put('/cancel/:meetingId', passportJwtAuthenticatJwt, cancelMeetingController)

export default meetingRoutes
