import { Router } from 'express'
import { passportJwtAuthenticatJwt } from '../config/passport.config'
import { getUserIntegrationsController } from '../controllers/integration.controller'

export const integrationRoutes = Router()

integrationRoutes.get('/all', passportJwtAuthenticatJwt, getUserIntegrationsController)
