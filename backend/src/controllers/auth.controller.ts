import { Request, Response } from 'express'
import { HTTPSTATUS } from '../config/http.config'
import { RegisterDto } from '../database/dto/auth.dto'
import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { registerService } from '../services/auth.service'

export const registerController = asyncHandlerAndValidation(
  RegisterDto,
  'body',
  async (req: Request, res: Response, registerDto) => {
    const { user } = await registerService(registerDto)

    return res.status(HTTPSTATUS.CREATED).json({
      message: 'User created successfully ',
      user
    })
  }
)
