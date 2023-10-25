import { SentenceWord } from "./sentence-word";

export interface Sentence {
    id: string,
    audio: string,
    sentence: string,
    words: SentenceWord[],
    answered: boolean
}