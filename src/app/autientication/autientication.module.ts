import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutienticationRoutingModule } from './autientication-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent
  ],
  imports: [
    CommonModule,
    AutienticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ToastModule,

      

  ],
})
export class AutienticationModule { }
