export interface Message {
    content: string
    date: string
    type: MessageType,
    conversationId?: string
}

export enum MessageType {
    Sent = 'Sent',
    Received = 'Received'
}