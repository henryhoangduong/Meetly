import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { compareValue, hashValue } from '../../utils/bcrypt'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false, unique: true })
  email: string
  @Column({ nullable: false, unique: true })
  username: string
  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  imageUrl: string

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashValue(this.password)
    }
  }
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await compareValue(candidatePassword, this.password)
  }

  omitPassword(): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = this
    return userWithoutPassword as Omit<User, 'password'>
  }
}
