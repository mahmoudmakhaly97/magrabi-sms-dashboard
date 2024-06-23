import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddUsersComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    TableModule,
    MultiSelectModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
