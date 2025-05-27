import { Router } from 'express'
import {
  createEventController,
  getUserEventsController,
  toggleEventPrivacyController
} from '../controllers/event.controller'
import { passportJwtAuthenticatJwt } from '../config/passport.config'

export const eventRoutes = Router()

eventRoutes.post(`/create`, passportJwtAuthenticatJwt, createEventController)
eventRoutes.get(`/all`, passportJwtAuthenticatJwt, getUserEventsController)
eventRoutes.get(`/toggle`, passportJwtAuthenticatJwt, toggleEventPrivacyController)
