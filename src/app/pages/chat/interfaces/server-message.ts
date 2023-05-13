import { Activity } from "./activity";
import { ContentType } from "./content-type";
import { MessageType } from "./message-type";

export interface ServerMessage {
    content_type: ContentType
    content: string | Activity,
    message_type: MessageType,
    transcription?: string
}