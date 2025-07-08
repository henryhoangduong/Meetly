import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { checkIntegrationService, getUserIntegrationsService } from '../services/integration.service'
import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { AppTypeDTO } from '../database/dto/integration.dto'

export const getUserIntegrationsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const integrations = await getUserIntegrationsService(userId || '')

  return res.status(HTTPSTATUS.OK).json({
    message: 'Fetched user integration successfully',
    integrations
  })
})
export const checkIntegrationController = asyncHandlerAndValidation(
  AppTypeDTO,
  'params',
  async (req: Request, res: Response, appTypeDTO) => {
    const userId = req.user?.id

    const isConnected = await checkIntegrationService(userId || '', appTypeDTO.appType)
    return res.status(HTTPSTATUS.OK).json({
      message: 'Integration checked successfully',
      isConnected
    })
  }
)

export const connectAppController = asyncHandlerAndValidation(
  AppTypeDTO,
  'params',
  async (req: Request, res: Response, appTypeDTO) => {
    const userId = req.user?.id
  }
)
