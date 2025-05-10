import { Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'
import { Availability } from './availability.entity'

export enum DayOfWeekEnumType {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
}

@Entity()
export class DayAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @ManyToOne(() => Availability, (availability) => availability.days)
  availability: Availability

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column({ default: true })
  isAvailable: boolean
}
