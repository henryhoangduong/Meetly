import { Request, Response } from 'express'
import { HTTPSTATUS } from '../config/http.config'
import { LoginDto, RegisterDto } from '../database/dto/auth.dto'
import { asyncHandlerAndValidation } from '../middleware/withValidation.middleware'
import { loginService, registerService } from '../services/auth.service'

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

export const loginController = asyncHandlerAndValidation(
  LoginDto,
  'body',
  async (req: Request, res: Response, loginDto) => {
    const { user, accessToken, expiresAt } = await loginService(loginDto)
    return res.status(HTTPSTATUS.OK).json({
      message: 'User created successfully ',
      user,
      accessToken,
      expiresAt
    })
  }
)
