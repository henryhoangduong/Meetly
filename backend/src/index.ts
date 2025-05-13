import 'reflect-metadata'
import 'dotenv/config'
import './config/passport.config'
import { config } from './config/app.config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { HTTPSTATUS } from './config/http.config'
import { errorHandler } from './middleware/errorHandler.middleware'
import { initializeDatabase } from './database/database'
import { authRoutes } from './routes/auth.route'
import passport from 'passport'
import { eventRoutes } from './routes/event.route'

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true
  })
)
app.use(passport.initialize())
app.use(`${BASE_PATH}/auth`, authRoutes)
app.use(`${BASE_PATH}/event`, eventRoutes)

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.status(HTTPSTATUS.OK).send('hello world')
})
app.use(errorHandler)
app.listen(config.PORT, async () => {
  await initializeDatabase()
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`)
})
