import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { RoleGuard } from '../shared/guard/role-guard.guard';

const routes: Routes = [
  {path:'',component:AddUsersComponent,canActivate: [RoleGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
