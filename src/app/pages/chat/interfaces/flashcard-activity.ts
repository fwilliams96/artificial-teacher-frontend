import { Activity } from "./activity";

export interface FlashCardActivity extends Activity {
    flashcard: FlashCard
}

export interface FlashCard {
    sentence: string
    correct_sentence: string
    correct_option: string
    options: string[]
}