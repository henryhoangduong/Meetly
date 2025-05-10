import { Request, Response } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.middleware'
import { HTTPSTATUS } from '../config/http.config'
import { plainToInstance } from 'class-transformer'
import { RegisterDto } from '../database/dto/auth.dto'
import { validate } from 'class-validator'
import { ErrorCodeEnum } from '../enums/error-code.enum'

export const registerController = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body
  const registerDto = plainToInstance(RegisterDto, body)
  const errors = await validate(registerDto)
  if (errors.length > 0) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: 'Validation error',
      errorCode: ErrorCodeEnum.VALIDATION_ERROR,
      errors: errors.map((error) => ({
        field: error.property,
        message: error.constraints
      }))
    })
  }
  return res.status(HTTPSTATUS.CREATED).json({
    message: 'User created successfully '
  })
})
