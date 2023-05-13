import { Activity } from "./activity";

export interface FlashCardActivity extends Activity {
    incorrect: string
    correct: string
    flashcard: FlashCard
}

export interface FlashCard {
    sentence: string
    correct_sentence: string
    options: string[]
}