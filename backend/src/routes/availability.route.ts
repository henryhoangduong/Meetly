import { Router } from 'express'
import { passportJwtAuthenticatJwt } from '../config/passport.config'
import { getUserAvailabilityController } from '../controllers/availability.controller'

export const availabilityRoutes = Router()
availabilityRoutes.get('/me', passportJwtAuthenticatJwt, getUserAvailabilityController)
