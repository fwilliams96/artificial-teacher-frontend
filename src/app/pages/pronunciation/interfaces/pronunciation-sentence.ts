import { PronunciationWord } from "./pronunciation-word";

export interface PronunciationSentence {
    id: string,
    audio: string,
    sentence: string,
    words: PronunciationWord[]
}