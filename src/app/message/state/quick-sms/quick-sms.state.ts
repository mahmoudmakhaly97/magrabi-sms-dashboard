import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SmsProviderService } from "../../services/sms-provider.service";
import { tap, catchError } from "rxjs";
import { userList } from "../../models/user.model";
import { PostSmsProviderAction } from "./quick-sms.action";
import { MessageService } from "primeng/api";

export interface smsProviderModelState {
    smsProviderResponse:any;
  }

@State<string[]>({
    name: 'smsProviderState',
    defaults: []
  })
  
  @Injectable()
  export class smsProviderState {

    constructor(private smsProvider:SmsProviderService,private toaster: MessageService){}


    @Selector()
    static getSmsProviderResonse(state: smsProviderModelState) {
      return state;
    }

    @Action(PostSmsProviderAction)
    postSmsProviderAction(
      { setState }: StateContext<smsProviderModelState>,{smsModel}:PostSmsProviderAction) {
      return this.smsProvider.callSmsProvider(smsModel).pipe(
        tap((response: any) => {
          setState(response)
          this.toaster.add({ severity: 'success', summary: 'Success', detail: "Queue Template Schdulled Sucessfully" });
        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
          return error;
        })
      );
    }

  }