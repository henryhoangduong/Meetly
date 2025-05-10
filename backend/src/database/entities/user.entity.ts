import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { compareValue, hashValue } from '../../utils/bcrypt'
import { Integration } from './integration.entity'
import { Event } from './event.entity'
import { Availability } from './availability.entity'
import { Meeting } from './meeting.entity'
import { IsEmail } from 'class-validator'
@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @IsEmail()
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

  @OneToMany(() => Integration, (itegration) => itegration.user, { cascade: true })
  integrations: Integration[]

  @OneToMany(() => Event, (event) => event.user, { cascade: true })
  events: Event[]

  @OneToOne(() => Availability, (availability) => availability.user, { cascade: true })
  @JoinColumn()
  availability: Availability

  @OneToMany(() => Meeting, (meeting) => meeting.user)
  meetings: Meeting[]

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
