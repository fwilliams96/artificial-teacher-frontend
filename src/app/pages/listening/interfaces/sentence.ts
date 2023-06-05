import { SafeUrl } from "@angular/platform-browser";
import { SentenceWord } from "./sentence-word";

export interface Sentence {
    id: string,
    correct_sentence: string,
    audio: string,
    audioBlob?: Blob,
    safeUrl?: SafeUrl,
    incomplete_sentence: string,
    words: SentenceWord[],
    answered: boolean
}