import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { IntegrationAppTypeEnum } from './integration.entity'
import { User } from './user.entity'
import { Meeting } from './meeting.entity'

export enum EventLocationEnumType {
  GOOGLE_MEET_AND_CALENDAR = IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
  ZOOM_MEETING = IntegrationAppTypeEnum.ZOOM_MEETING
}

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  title: string
  @Column({ default: 30 })
  duration: number
  @Column({ nullable: true })
  description: string

  @Column({ nullable: false })
  slug: string

  @Column({ default: false })
  isPrivate: boolean

  @ManyToOne(() => User, (user) => user.events)
  user: User
  @OneToMany(() => Meeting, (meeting) => meeting.event)
  meetings: Meeting[]
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  @Column({ type: 'enum', enum: EventLocationEnumType })
  locationType: EventLocationEnumType
}
