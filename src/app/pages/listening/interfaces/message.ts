import { Activity } from "./activity"
import { ContentType } from "./content-type"
import { MessageType } from "./message-type"

export interface Message {
    type: MessageOrigin,
    content_type: ContentType,
    message_type: MessageType,
    content: string | Activity | Blob
}

export enum MessageOrigin {
    User = 'User',
    Server = 'Server'
}