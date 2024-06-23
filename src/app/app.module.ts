import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AutienticationModule } from './autientication/autientication.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MessageState } from './message/state/template.state';
import { ToastModule } from 'primeng/toast';
import { NgxsModule } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { UserState } from './message/state/users/user.state';
import { AuthState } from './autientication/state/auth.state';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { smsProviderState } from './message/state/quick-sms/quick-sms.state';
import { AddUserState } from './users/state/user.state';
import { SmsproviderInterceptor } from './shared/interceptor/smsprovider.interceptor';
import { SmsState } from './shared/state/smsprovider.state';
import { branchState } from './message/state/branches/branches.state';
import { FormsModule } from '@angular/forms';
import { historyState } from './message/state/filter-history/filter-history.state';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    RouterModule,
    AutienticationModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([MessageState,UserState,AuthState,smsProviderState,AddUserState,SmsState,branchState,historyState]),
    ToastModule,
    FormsModule
  ],
  providers: [MessageService,{provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SmsproviderInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
