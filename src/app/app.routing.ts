import { ModuleWithProviders } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomeComponent } from "./pages/home/container/home/home.component"
import { ChatComponent } from "./pages/chat/container/chat/chat.component"

const appRoutes: Routes = [
    // { path: '', component: HomeComponent }
    { path: '', redirectTo: '/chat', pathMatch: 'full' },
    { path: 'chat', component: ChatComponent }
  ]
  
  export const appRoutingProviders: any[] = []
  export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(
    appRoutes,
    { scrollPositionRestoration: 'enabled' }
  )
  