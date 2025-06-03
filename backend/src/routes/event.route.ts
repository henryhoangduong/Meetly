import { Router } from 'express'
import {
  createEventController,
  getPublicEventsByUsernameAndSlugController,
  getPublicEventsByUsernameController,
  getUserEventsController,
  toggleEventPrivacyController
} from '../controllers/event.controller'
import { passportJwtAuthenticatJwt } from '../config/passport.config'

export const eventRoutes = Router()

eventRoutes.post(`/create`, passportJwtAuthenticatJwt, createEventController)
eventRoutes.get(`/all`, passportJwtAuthenticatJwt, getUserEventsController)
eventRoutes.put(`/toggle-privacy`, passportJwtAuthenticatJwt, toggleEventPrivacyController)
eventRoutes.get('/public/:username', getPublicEventsByUsernameController)
eventRoutes.get('/public/:username/:slug', getPublicEventsByUsernameAndSlugController)
