import { Router } from 'express'
import { passportJwtAuthenticatJwt } from '../config/passport.config'
import { getUserMeetingsController } from '../controllers/meeting.controller'

export const meetingRoutes = Router()

meetingRoutes.get('/user/all', passportJwtAuthenticatJwt, getUserMeetingsController)
