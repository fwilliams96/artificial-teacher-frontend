import { SentenceWord } from "./sentence-word";

export interface Sentence {
    id: string,
    correct_sentence: string,
    audio: string,
    incomplete_sentence: string,
    words: SentenceWord[],
    answered: boolean
}