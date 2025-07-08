import { Router } from 'express'
import { passportJwtAuthenticatJwt } from '../config/passport.config'
import { checkIntegrationController, getUserIntegrationsController } from '../controllers/integration.controller'

export const integrationRoutes = Router()

integrationRoutes.get('/all', passportJwtAuthenticatJwt, getUserIntegrationsController)
integrationRoutes.get('/check/:appType', passportJwtAuthenticatJwt, checkIntegrationController)
