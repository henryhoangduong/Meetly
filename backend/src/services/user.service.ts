import { AppDataSource } from '../config/database.config'
import { User } from '../database/entities/user.entity'

export const findByIdUserService = async (userId: string) => {
  const userRepository = await AppDataSource.getRepository(User)
  const user = userRepository.findOne({ where: { id: userId } })
  return user
}
