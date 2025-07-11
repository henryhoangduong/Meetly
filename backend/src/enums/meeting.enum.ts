export const MeetingFilterEnum = {
  UPCOMING: 'UPCOMING',
  PAST: 'PAST',
  CANCELLED: 'CANCELLED'
}

export type MeetingFilterEnumType = (typeof MeetingFilterEnum)[keyof typeof MeetingFilterEnum]
