import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { compareValue, hashValue } from '../../utils/bcrypt'
import { Integration } from './integration.entities'

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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Integration, (itegration) => itegration.user)
  integrations: Integration[]

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
