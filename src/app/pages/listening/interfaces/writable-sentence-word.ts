import { SentenceWord } from "./sentence-word";

export interface WritableSentenceWord extends SentenceWord{
    userValue: string
}