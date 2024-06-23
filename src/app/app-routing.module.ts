import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'account', pathMatch: 'full' }, 
  {path:'account',loadChildren: () => import('./autientication/autientication.module').then(m => m.AutienticationModule)},
  {path:'messages',component:LayoutComponent,loadChildren: () => import('./message/message.module').then(m => m.MessageModule)},
  {path:'dashboard',component:LayoutComponent,loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)},
  {path:'users',component:LayoutComponent,loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
