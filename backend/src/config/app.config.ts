import { getEnv } from '../utils/get-env'

const appConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', '5000'),
  BASE_PATH: getEnv('BASE_PATH', '/api'),

  DATABASE_URL: getEnv('DATABASE_URL'),

  JWT_SECRET: getEnv('JWT_SECRET', 'secert_jwt'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '1d'),

  SESSION_SECRET: getEnv('SESSION_SECRET'),
  SESSION_EXPIRES_IN: getEnv('SESSION_EXPIRES_IN'),

  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: getEnv('GOOGLE_REDIRECT_URI'),

  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN', 'localhost'),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv('FRONTEND_GOOGLE_CALLBACK_URL'),
  FRONTEND_INTEGRATION_URL: getEnv('FRONTEND_INTEGRATION_URL')
})

export const config = appConfig()
