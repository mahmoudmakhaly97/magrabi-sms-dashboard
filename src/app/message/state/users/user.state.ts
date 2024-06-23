import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { userList } from "../../models/user.model";
import { tap, catchError } from "rxjs";
import { tempList } from "../../models/tempConfig.model";
import { UserService } from "../../services/user.service";
import { MessageService } from "primeng/api";
import { GetAppApprovalListAction, GetAppCancelListAction } from "./user.action";


export interface userModelState {
    approvalUserList:userList[];
    cancelUserList:userList[];
  }

@State<string[]>({
    name: 'userState',
    defaults: []
  })


  @Injectable()
  export class UserState {
    approvalUserList:userList[]=[];
    cancelUserList:userList[]=[];
    constructor(private userService:UserService,private toaster: MessageService){}

    @Selector()
    static getAllUserList(state: userModelState) {
      return state;
    }
        
  @Action(GetAppApprovalListAction)
  getAppApprovalListAction(
    { patchState }: StateContext<userModelState>) {
    return this.userService.getAppApprovalList().pipe(
      tap((response: userList[]) => {
        this.approvalUserList=response;
        patchState({ approvalUserList: this.approvalUserList });
      }),
      catchError((error) => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
        return error;
      })
    );
  }
  @Action(GetAppCancelListAction)
  getAppCancelListAction(
    { patchState }: StateContext<userModelState>) {
    return this.userService.getAppCancelList().pipe(
      tap((response: userList[]) => {
        this.cancelUserList=response;
        patchState({ cancelUserList: this.cancelUserList });
      }),
      catchError((error) => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
        return error;
      })
    );
  }
  }