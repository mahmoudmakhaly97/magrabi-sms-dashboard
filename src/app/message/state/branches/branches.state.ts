import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AddNewBranchAction, EditBranchAction, GetAllAreasAction, GetAllBranchesAction, GetBranchByIdAction } from "./branches.action";
import { BranchesService } from "../../services/branches.service";
import { catchError, tap } from "rxjs";
import { MessageService } from "primeng/api";

export interface branchModelState {
    branchModelResponse:any;
    areaList:any;
    branchByIdList:any;
  }

@State<string[]>({
    name: 'branchState',
    defaults: []
  })
  
@Injectable()
export class branchState {
    constructor(private branchServicce:BranchesService,private toaster:MessageService){}

    @Selector()
    static getbranches(state:branchModelState ) {
      return state.branchModelResponse;
    }
    @Selector()
    static getAreas(state:branchModelState ) {
      return state.areaList;
    }
    @Selector()
    static getBranchesByAreaId(state:branchModelState ) {
      return state.branchByIdList;
    }

    @Action(AddNewBranchAction)
    AddNewBranch({ setState }: StateContext<branchModelState>,{branchModel}:AddNewBranchAction){
        return this.branchServicce.addBranch(branchModel).pipe(
            tap((response: any) => {
              setState(response);
              this.toaster.add({ severity: 'success', summary: 'Success', detail: "Branch added Sucessfully" });
            }),
            catchError((error) => {
              this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
              return error;
            })
          );
    }
    @Action(EditBranchAction)
    editBranchAction({ setState }: StateContext<branchModelState>,{branchModel}:EditBranchAction){
        return this.branchServicce.editBranch(branchModel).pipe(
            tap((response: any) => {
              setState(response);
              this.toaster.add({ severity: 'success', summary: 'Success', detail: "Branch added Sucessfully" });
            }),
            catchError((error) => {
              this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
              return error;
            })
          );
    }

    @Action(GetAllBranchesAction)
    getAllbranchesAction({ patchState }: StateContext<branchModelState> ) {
      return this.branchServicce.getAllBranches().pipe(
        tap((response:any) => {
            patchState({branchModelResponse:response});

        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail:error });
          return error;
        })
      );
    }
    @Action(GetAllAreasAction)
    getAllAreasAction({ patchState }: StateContext<branchModelState>,{regionId}:GetAllAreasAction ) {
      return this.branchServicce.getAllAreas(regionId).pipe(
        tap((response:any) => {
          patchState({areaList:response});
        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail:error });
          return error;
        })
      );
    }
    @Action(GetBranchByIdAction)
    getBranchByIdAction({ patchState }: StateContext<branchModelState>,{areaId}:GetBranchByIdAction ) {
      return this.branchServicce.getBrancheById(areaId).pipe(
        tap((response:any) => {
          patchState({branchByIdList:response});

        }),
        catchError((error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail:error });
          return error;
        })
      );
    }
}