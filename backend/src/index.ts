import 'dotenv/config'
import { config } from './config/app.config'
import express from 'express'

const app = express()

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`)
})
