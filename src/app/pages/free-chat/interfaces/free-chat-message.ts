export enum FreeChatMessageType {
    SPEECH = 'SPEECH',
    TEXT = 'TEXT'
}

export enum FreeChatMessageOrigin {
    AGENT = 'AGENT',
    USER = 'USER'
}

export interface FreeChatMessage {
    id?: string | undefined
    type: FreeChatMessageType
    message: string
    sender_id?: string | undefined
    chat_id?: string
    sent_date?: string
    origin?: FreeChatMessageOrigin
}