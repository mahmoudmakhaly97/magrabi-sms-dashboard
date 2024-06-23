import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap, catchError } from "rxjs";
import { SmsProviderService } from "src/app/message/services/sms-provider.service";
import { MessageService } from "primeng/api";
import { GetStatisticsAction } from "./smsprovider.action";



export interface smsState {
    smsStatics:any
  }

@State<string[]>({
    name: 'smsState',
    defaults: []
  })
  @Injectable()
  export class SmsState {
    constructor(private smsServiceProvider:SmsProviderService,
                private toaster:MessageService){}

    @Selector()
    static getSmsStatics(state: smsState) {
      return state.smsStatics;
    }

    @Action(GetStatisticsAction)
    getStatisticsAction({ setState }: StateContext<smsState>,{object}:any) {
      return this.smsServiceProvider.getStatisticsSmsProvider(object).pipe(
        tap((response: any) => {
          setState(response);
        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: error });
          return error;
        })
      );
    }

  }