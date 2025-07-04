import { Router } from 'express'
import { passportJwtAuthenticatJwt } from '../config/passport.config'
import {
  getAvailabilityForPublicEventController,
  getUserAvailabilityController,
  updateAvailabilityController
} from '../controllers/availability.controller'

export const availabilityRoutes = Router()
availabilityRoutes.get('/me', passportJwtAuthenticatJwt, getUserAvailabilityController)
availabilityRoutes.put('/update', passportJwtAuthenticatJwt, updateAvailabilityController)
availabilityRoutes.get('/public/:eventId', getAvailabilityForPublicEventController)
