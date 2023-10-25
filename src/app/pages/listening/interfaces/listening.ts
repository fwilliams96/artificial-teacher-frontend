import { Sentence } from "./sentence"

export interface Listening {
    id?: string | undefined,
    topic: string,
    user_id?: string | undefined
    finished: boolean,
    sentences: Sentence[],
    routine_id?: string | undefined
}