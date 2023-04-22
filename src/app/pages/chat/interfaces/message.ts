export interface Message {
    content: string
    type: MessageType,
    transcription?: string | undefined,
    urlAudioBlob?: string | undefined
}

export enum MessageType {
    Sent = 'Sent',
    Received = 'Received'
}