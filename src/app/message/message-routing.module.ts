import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendQuickMessageComponent } from './send-quick-message/send-quick-message.component';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ConfigMessageComponent } from './config-message/config-message.component';
import { SmsHistoryComponent } from './sms-history/sms-history.component';
import { TemplateQueueComponent } from './template-queue/template-queue.component';
import { MessageControlComponent } from './message-control/message-control.component';
import { BranchesComponent } from './branches/branches.component';
import { HealthLinkHistoryComponent } from './healthLink-history/healthLink-history.component';

const routes: Routes = [
    {path:'',component:SendQuickMessageComponent},
    {path:'quick-message',component:SendQuickMessageComponent},
    {path:'config-message',component:MessageControlComponent},
    {path:'sms-history',component:SmsHistoryComponent},
    {path:'template-queue',component:TemplateQueueComponent},
  { path: 'branches', component: BranchesComponent },
    {path:'healthLink-history',component:HealthLinkHistoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule { }
