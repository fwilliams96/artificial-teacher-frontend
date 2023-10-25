import { RolePlayMessage } from "./role-play-message"

export enum RolePlayType {
    JOB_INTERVIEW = 'JOB_INTERVIEW',
    BUY_SUPERMARKET = 'BUY_SUPEMARKET',
    CHECKIN_AIRPORT = 'CHECKIN_AIRPORT',
    ORDER_FOOD_RESTAURANT = 'ORDER_FOOD_RESTAURANT',
    CHECKIN_ACCOMMODATION = 'CHECKIN_ACCOMMODATION',
    DOCTOR_VISIT = 'DOCTOR_VISIT',
    TRAVEL_AGENCY = 'TRAVEL_AGENCY',
    PARENTS_SCHOOL_MEETING = 'PARENTS_SCHOOL_MEETING',
    PARTYING_WITH_STRANGERS = 'PARTYING_WITH_STRANGERS',
    URGENCY_CALL_POLICE = 'URGENCY_CALL_POLICE'
}

export interface RolePlay {
    id?: string | undefined
    type: RolePlayType
    messages: RolePlayMessage[]
    is_over: boolean
    user_id: string
    routine_id?: string,
    creation_date: string
}