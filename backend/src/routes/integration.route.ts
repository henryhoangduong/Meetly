import { Router } from 'express'
import { passportJwtAuthenticatJwt } from '../config/passport.config'
import {
  checkIntegrationController,
  connectAppController,
  getUserIntegrationsController,
  googleOAuthCallbackController
} from '../controllers/integration.controller'

export const integrationRoutes = Router()

integrationRoutes.get('/all', passportJwtAuthenticatJwt, getUserIntegrationsController)
integrationRoutes.get('/check/:appType', passportJwtAuthenticatJwt, checkIntegrationController)
integrationRoutes.get('/connect/:appType', passportJwtAuthenticatJwt, connectAppController)
integrationRoutes.get('/google/callback', googleOAuthCallbackController)
