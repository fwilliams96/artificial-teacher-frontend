import { FreeChatMessage } from "./free-chat-message"

export interface FreeChat {
    id: string | undefined
    messages: FreeChatMessage[]
    creation_date: string
    participants: string[]
    is_over: boolean
}