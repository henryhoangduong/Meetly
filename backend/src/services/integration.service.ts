import { AppDataSource } from '../config/database.config'
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum
} from '../database/entities/integration.entity'
const appTypeToProviderMap: Record<IntegrationAppTypeEnum, IntegrationProviderEnum> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: IntegrationProviderEnum.GOOGLE,
  [IntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationProviderEnum.ZOOM,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationProviderEnum.MICROSOFT
}
const appTypeToCategoryMap: Record<IntegrationAppTypeEnum, IntegrationCategoryEnum> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationCategoryEnum.VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationCategoryEnum.CALENDAR
}
const appTypeToTitleMap: Record<IntegrationAppTypeEnum, string> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: 'Google Meet & Calendar',
  [IntegrationAppTypeEnum.ZOOM_MEETING]: 'Zoom',
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: 'Outlook Calendar'
}

export const getUserIntegrationsService = async (userId: string) => {
  const integrationRepository = AppDataSource.getRepository(Integration)
  const userIntegrations = await integrationRepository.find({
    where: { user: { id: userId } }
  })

  const connectedMap = new Map(userIntegrations.map((itegration) => [itegration.app_type, true]))
  return Object.values(IntegrationAppTypeEnum).flatMap((appType) => {
    return {
      provider: appTypeToProviderMap[appType],
      app_type: appTypeToTitleMap[appType],
      title: appType,
      category: appTypeToCategoryMap[appType],
      isConnected: connectedMap.has(appType) || false
    }
  })
}
