import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { getUserIntegrationsService } from '../services/integration.service'

export const getUserIntegrationsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id
  const integrations = await getUserIntegrationsService(userId || '')

  return res.status(HTTPSTATUS.OK).json({
    message: 'Fetched user integration successfully',
    integrations
  })
})
