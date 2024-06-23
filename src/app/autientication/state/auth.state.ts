import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { MessageService } from "primeng/api";
import { AuthService } from "../services/auth.service";
import { AuthLogin } from "../models/auth.model";
import { tap, catchError, Observable, of } from "rxjs";
import { GetRoleBaseAction, GetTokenAction, GetUsernameAction, LoginAction, LogoutAction, RemoveTokenAction, SetTokenAction } from "./auth.action";

export interface authModelState {
    token:string | null;
    expireDate:string | null;
    role:string | null;
    username:string | null;
  }

@State<string[]>({
  name: 'authState',
  defaults: []
})
@Injectable()
export class AuthState {
    constructor(private authService:AuthService,private toaster: MessageService ){}

    @Selector()
    static login(state: authModelState) {
      return state;
    }
    @Selector()
    static role(state: authModelState) {
      return state.role;
    }
    @Selector()
    static username(state: authModelState) {
      return state.username;
    }


    @Action(LoginAction)
    loginAction({ setState ,dispatch }: StateContext<authModelState> , {credentails}:LoginAction) {
      return this.authService.login(credentails).pipe(
        tap((response) => {
            setState(response);
            dispatch(new SetTokenAction(response))
            dispatch(new GetRoleBaseAction())
            dispatch(new GetUsernameAction())

        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail:"Unauthorized User" });
          return error;
        })
      );
    }
    
    @Action(SetTokenAction)
    setTokenAction({}: StateContext<authModelState> , {token}:SetTokenAction) {
      return this.authService.storeToken(token)
    }

    @Action(RemoveTokenAction)
    removeTokenAction({ setState ,dispatch}: StateContext<authModelState>): Observable<any> {
     return  this.authService.deleteToken().pipe(
        tap(() => {
          setState({ token: null ,expireDate:null , role:null ,username:null});
        }),
      catchError((error) => {
        console.error('Error while removing token:', error);
        return of(null);
      })
      )}


    // @Action(LogoutAction)
    // logoutAction({ setState }: StateContext<authModelState>) {
    //   setState({
    //     token:null,
    //     expireDate:null,
    //     role:null
    //   });
    // }

    @Action(GetRoleBaseAction)
    getRoleFromToken({ patchState ,dispatch ,getState}: StateContext<authModelState>) {
        return this.authService.getRoleFromToken().pipe(
            tap((role:any) => {
              patchState({ role:role });
          
              if(!role){
                this.toaster.add({ severity: 'error', summary: 'Error', detail:"Unauthorized User" });
              }
            })
        );
    }
    @Action(GetUsernameAction)
    getUsername({ patchState}: StateContext<authModelState>) {
        return this.authService.getUsername().pipe(
            tap((username:any) => {
              patchState({ username:username });
              if(!username){
                this.toaster.add({ severity: 'error', summary: 'Error', detail:"Unauthorized User" });
              }
            })
        );
    }
}