import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { MessageService } from "primeng/api";
import { tap, catchError } from "rxjs";
import { authModelState } from "src/app/autientication/state/auth.state";
import { AddUserAction, GetAllUserAction } from "./user.action";
import { UsersService } from "src/app/users/services/users.service";

export interface userModelState {
    userState:any,
    userList:any
  }

@State<string[]>({
  name: 'addUserState',
  defaults: []
})

@Injectable()
export class AddUserState {
    constructor(private userService:UsersService,private toaster: MessageService ){}

    @Selector()
    static addUser(state: any) {
      return state;
    }

    @Selector()
    static getAllUser(state: userModelState) {
      return state.userList;
    }

    @Action(AddUserAction)
    addUserAction({ setState ,dispatch }: StateContext<userModelState> , {user}:AddUserAction) {
      return this.userService.addUser(user).pipe(
        tap((response) => {
            setState(response);

        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail:error });
          return error;
        })
      );
    }
    @Action(GetAllUserAction)
    getAllUserAction({ patchState ,dispatch }: StateContext<userModelState> ) {
      return this.userService.getAllUser().pipe(
        tap((response:any) => {
          patchState({userList:response});

        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail:error });
          return error;
        })
      );
    }
    

}


