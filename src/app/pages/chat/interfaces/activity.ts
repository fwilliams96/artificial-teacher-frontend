import { ActivityType } from "./activity-type"

export interface Activity {
    incorrect: string
    correct: string
    activity_type: ActivityType
    comments?: string | undefined,
    active: boolean
}