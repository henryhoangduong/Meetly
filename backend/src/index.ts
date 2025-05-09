import 'reflect-metadata'
import 'dotenv/config'
import { config } from './config/app.config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { HTTPSTATUS } from './config/http.config'
import { errorHandler } from './middleware/errorHandler.middleware'
import { initializeDatabase } from './database/database'

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(errorHandler)

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true
  })
)

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.status(HTTPSTATUS.OK).send('hello world')
})
app.listen(config.PORT, async () => {
  await initializeDatabase()
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`)
})
