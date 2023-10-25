import { PronunciationSentence } from "./pronunciation-sentence"
import { UserSpeech } from "./user-speech"

export interface Pronunciation {
    id?: string | undefined,
    topic: string,
    user_id?: string | undefined
    finished: boolean,
    sentence: PronunciationSentence,
    user_speech?: UserSpeech,
    routine_id?: string | undefined
}