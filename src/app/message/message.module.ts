import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SendQuickMessageComponent } from './send-quick-message/send-quick-message.component';
import { SharedModule } from '../shared/shared.module';
import { MessageRoutingModule } from './message-routing.module';
import { MessageControlComponent } from './message-control/message-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigMessageComponent } from './config-message/config-message.component';
import { SmsHistoryComponent } from './sms-history/sms-history.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TemplateQueueComponent } from './template-queue/template-queue.component';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { BranchesComponent } from './branches/branches.component';



@NgModule({
  declarations: [
    SendQuickMessageComponent,
    MessageControlComponent,
    ConfigMessageComponent,
    SmsHistoryComponent,
    TemplateQueueComponent,
    BranchesComponent,
  ],
  imports: [
    CommonModule,
    MessageRoutingModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    ToastModule,
    SharedModule,
    TableModule,
    MultiSelectModule,
    TagModule,
    DropdownModule,
    ButtonModule
  ],

})
export class MessageModule { }
