import { ModuleWithProviders } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LoginComponent } from "./pages/login/container/login/login.component"
import { identityGuard } from "./shared/modules/auth/guards/identity/identity.guard"
import { registerGuard } from "./shared/modules/auth/guards/register/register.guard"
import { RegisterComponent } from "./pages/register/container/register/register.component"
import { HomeComponent } from "./pages/home/container/home/home.component"
import { ChatComponent } from "./pages/chat/container/chat/chat.component"
import { ListeningComponent } from "./pages/listening/container/listening/listening.component"
import { MyCardsComponent } from "./pages/my-cards/container/my-cards/my-cards.component"

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'chat', component: ChatComponent, canActivate: [identityGuard] },
    { path: 'listening', component: ListeningComponent, canActivate: [identityGuard] },
    { path: 'my-cards', component: MyCardsComponent, canActivate: [identityGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, canActivate: [registerGuard] }
  ]
  
  export const appRoutingProviders: any[] = []
  export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(
    appRoutes,
    { scrollPositionRestoration: 'enabled' }
  )
  