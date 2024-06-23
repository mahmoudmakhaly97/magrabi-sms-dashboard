import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs';
import { EditTemplateAction, GetAllTemplateAction, updateTemplateStatusAction } from './template.action';
import { TemplateService } from '../services/template.service';
import { tempConfig, tempList } from '../models/tempConfig.model';
import { MessageService } from 'primeng/api';

export interface messageModelState {
    tempConfigData: tempConfig;
    allTemp:tempList[];
  }

@State<string[]>({
  name: 'messageState',
  defaults: []
})
@Injectable()
export class MessageState {
  templateList:tempList[]=[];
    constructor(private templateService:TemplateService,
                private toaster: MessageService,
                ){}

    @Selector()
    static getAllTemplate(state: messageModelState) {
      return state.allTemp;
    }

    
  @Action(GetAllTemplateAction)
  getAllTemplateAction(
    { patchState }: StateContext<messageModelState>) {
    return this.templateService.getAllTemplates().pipe(
      tap((response: tempList[]) => {
        this.templateList=response;
        patchState({ allTemp: this.templateList });
      }),
      catchError((error) => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
        return error;
      })
    );
  }

  @Action(EditTemplateAction)
  editTemplateAction(
    { setState,patchState ,dispatch }: StateContext<messageModelState>,{template}:EditTemplateAction) {
    return this.templateService.editTemplates(template.id,template).pipe(
      tap((response: tempList) => {
        patchState({ tempConfigData: response });
        dispatch(new GetAllTemplateAction())
        this.toaster.add({ severity: 'success', summary: 'Success', detail: "Template Updated Sucessfully" });
      }),
      catchError((error) => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
        return error;
      })
    );
  }

  @Action(updateTemplateStatusAction)
  updateTemplateStatusAction(
    { setState,patchState ,dispatch ,getState}: StateContext<messageModelState>,{template}:updateTemplateStatusAction) {
    return this.templateService.editTemplates(template.id,template).pipe(
      tap((response: tempList) => {
        const state=getState().allTemp;
        const filteredTempList=state.filter((temp)=> temp.id !== template.id)
        patchState({ allTemp: filteredTempList });
        dispatch(new GetAllTemplateAction())
        if(response.run==true){
          this.toaster.add({ severity: 'success', summary: 'Success', detail: "Now,Template is Running !" });
        }
        else{
          this.toaster.add({ severity: 'success', summary: 'Success', detail: "Now,Template is Stopped !" });
        }
      }),
      catchError((error) => {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: error.error.error });
        return error;
      })
    );
  }




}