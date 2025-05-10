import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { plainToInstance } from 'class-transformer'
import { RegisterDto } from '../database/dto/auth.dto'
import { validate } from 'class-validator'
import { ErrorCodeEnum } from '../enums/error-code.enum'
import { withValidation } from '../middleware/withValidation.middleware'

export const registerController = asyncHandler(
  withValidation(
    RegisterDto,
    'body'
  )(async (req: Request, res: Response, registerDto) => {
    console.log(registerDto)
    return res.status(HTTPSTATUS.CREATED).json({
      message: 'User created successfully '
    })
  })
)
