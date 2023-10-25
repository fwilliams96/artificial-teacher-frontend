import { Listening } from "../../listening/interfaces/listening";
import { Pronunciation } from "../../pronunciation/interfaces/pronunciation";
import { RolePlay } from "../../role-play/interfaces/role-play";

export interface Routine {
    id?: string | undefined
    role_play: RolePlay,
    listenings: Listening[],
    pronunciations: Pronunciation[],
    topic: string
}