import { ContentType } from "./content-type";
import { MessageType } from "./message-type";

export interface UserMessage {
    content: string,
    content_type: ContentType,
    message_type?: MessageType
}