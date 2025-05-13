import { Router } from 'express'
import { createEventController } from '../controllers/event.controller'
import { passportJwtAuthenticatJwt } from '../config/passport.config'

export const eventRoutes = Router()

eventRoutes.post(`/create`, passportJwtAuthenticatJwt, createEventController)
