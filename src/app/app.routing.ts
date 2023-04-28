import { ModuleWithProviders } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ChatComponent } from "./pages/chat/container/chat/chat.component"
import { LoginComponent } from "./pages/login/container/login/login.component"
import { identityGuard } from "./shared/modules/auth/guards/identity/identity.guard"
import { registerGuard } from "./shared/modules/auth/guards/register/register.guard"
import { RegisterComponent } from "./pages/register/container/register/register.component"

const appRoutes: Routes = [
    // { path: '', component: HomeComponent }
    { path: '', redirectTo: '/chat', pathMatch: 'full' },
    { path: 'chat', component: ChatComponent, canActivate: [identityGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent, canActivate: [registerGuard] }
  ]
  
  export const appRoutingProviders: any[] = []
  export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(
    appRoutes,
    { scrollPositionRestoration: 'enabled' }
  )
  