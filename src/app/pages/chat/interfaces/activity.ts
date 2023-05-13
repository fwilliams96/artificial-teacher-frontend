import { ActivityType } from "./activity-type"

export interface Activity {
    activity_type: ActivityType
    comments?: string | undefined
}