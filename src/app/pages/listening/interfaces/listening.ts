import { Sentence } from "./sentence"

export interface Listening {
    id: string,
    topic: string,
    sentences: Sentence[]
}