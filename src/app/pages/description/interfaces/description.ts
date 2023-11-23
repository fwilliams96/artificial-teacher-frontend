import { SafeUrl } from "@angular/platform-browser"
import { DescriptionCorrection } from "./description-correction"
import { DescriptionSolution } from "./description-solution"

export interface Description {
    id?: string
    topic: string
    user_id: string
    finished: boolean
    image: string
    image_url: SafeUrl | undefined
    user_solution?: DescriptionSolution | undefined
    correction?: DescriptionCorrection | undefined
    routine_id?: string | undefined
}