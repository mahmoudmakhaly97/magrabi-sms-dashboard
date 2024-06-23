import { Injectable } from "@angular/core";
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { MessageService } from "primeng/api";
import { FilterHistoryService } from "../../services/filter-history.service";
import { tap, catchError } from "rxjs";
import { FilterHistoryAction } from "./filter-history.action";

export interface FilterHistoryState {
    filterResponse:any;
  }

@State<string[]>({
    name: 'historyState',
    defaults: []
  })
  
  @Injectable()
  export class historyState {

    constructor(private filterService:FilterHistoryService,private toaster: MessageService){}


    @Selector()
    static getFilterResponse(state: FilterHistoryState) {
      return state;
    }

    @Action(FilterHistoryAction)
    filterHistoryAction(
      { setState }: StateContext<FilterHistoryState>,{filterModel}:FilterHistoryAction) {
      return this.filterService.getFilterHistory(filterModel).pipe(
        tap((response: any) => {
          setState(response)
          this.toaster.add({ severity: 'success', summary: 'Success', detail: "Filtred Data Returned Sucessfully" });
        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
          return error;
        })
      );
    }
}
