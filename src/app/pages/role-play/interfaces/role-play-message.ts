export enum RolePlayMessageType {
    SPEECH = 'SPEECH',
    TEXT = 'TEXT'
}

export enum RolePlayMessageOrigin {
    AGENT = 'AGENT',
    USER = 'USER'
}

export interface RolePlayMessage {
    id?: string | undefined
    type: RolePlayMessageType
    message: string
    sender_id?: string | undefined
    role_play_id?: string
    sent_date?: string
    last_message?: boolean
    origin?: RolePlayMessageOrigin
}