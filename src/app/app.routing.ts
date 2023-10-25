import { ModuleWithProviders } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LoginComponent } from "./pages/login/container/login/login.component"
import { RegisterComponent } from "./pages/register/container/register/register.component"
import { HomeComponent } from "./pages/home/container/home/home.component"
import { ChatComponent } from "./pages/chat/container/chat/chat.component"
import { ListeningComponent } from "./pages/listening/container/listening/listening.component"
import { MyCardsComponent } from "./pages/my-cards/container/my-cards/my-cards.component"
import { FreeChatComponent } from "./pages/free-chat/container/free-chat/free-chat.component"
import { MyRoutineComponent } from "./pages/my-routine/container/my-routine/my-routine.component"
import { MyRoutinesComponent } from "./pages/my-routines/container/my-routines/my-routines.component"
import { RolePlayComponent } from "./pages/role-play/container/role-play/role-play.component"
import { WallOfFameComponent } from "./pages/wall-of-fame/container/wall-of-fame/wall-of-fame.component"
import { identityGuard } from "./shared/modules/user/guards/identity/identity.guard"
import { registerGuard } from "./shared/modules/user/guards/register/register.guard"
import { PronunciationComponent } from "./pages/pronunciation/container/pronunciation/pronunciation.component"

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'chat', component: ChatComponent, canActivate: [identityGuard] },
    { path: 'free-chat/:id', component: FreeChatComponent, canActivate: [identityGuard] },
    { path: 'listening/:id', component: ListeningComponent, canActivate: [identityGuard] },
    { path: 'pronunciation/:id', component: PronunciationComponent, canActivate: [identityGuard] },
    { path: 'my-cards', component: MyCardsComponent, canActivate: [identityGuard] },
    { path: 'my-routines', component: MyRoutinesComponent, canActivate: [identityGuard] },
    { path: 'my-routine/:id', component: MyRoutineComponent, canActivate: [identityGuard] },
    { path: 'role-play/:id', component: RolePlayComponent, canActivate: [identityGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'wall-of-fame', component: WallOfFameComponent },
    { path: 'register', component: RegisterComponent, canActivate: [registerGuard] }
  ]
  
  export const appRoutingProviders: any[] = []
  export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(
    appRoutes,
    { scrollPositionRestoration: 'enabled' }
  )
  