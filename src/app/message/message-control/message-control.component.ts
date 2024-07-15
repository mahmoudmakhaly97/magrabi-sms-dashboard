import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TemplateService } from '../services/template.service';
import { MessageState } from '../state/template.state';
import { Select, Store } from '@ngxs/store';
import { Observable, finalize } from 'rxjs';
import { tempConfig, tempList } from '../models/tempConfig.model';
import { EditTemplateAction, GetAllTemplateAction, updateTemplateStatusAction } from '../state/template.action';
import { MessageService } from 'primeng/api';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { AuthState } from 'src/app/autientication/state/auth.state';

@Component({
  selector: 'app-message-control',
  templateUrl: './message-control.component.html',
  styleUrls: ['./message-control.component.scss']
})
export class MessageControlComponent implements OnInit{
   templateConfigurationForm: FormGroup;
  


  englishDynamicContent: string =   `Dear {{Name}},\nfor your appointment on {{date}} at {{time}},\nplease bring your ID proof and insurance details. Thank you for choosing Magrabi Health Care!`;
  arabicdDynamicContent: string =   `عزيزي {{Name}}،\nلتحديد موعدك في {{date}} في {{time}}،\nيُرجى إحضار إثبات هويتك وتفاصيل التأمين. شكرًا لاختيارك مغربي للرعاية الصحية!`;
  breadCrumbItems: Array<{}>;
  selectedTemplateID: any=''; 
  selectedregionID:any='';
  isSelectDisabled:boolean=true;
   returnTemplateConfig:tempConfig;
  templateDetailList:tempList[];
  runTempList:tempList[];
  stoppedTempList:tempList[];
  updateTemplateForm:boolean=true;
  getTodayDate=moment(new Date()).format('YYYY-MM-DD');
  showLoader:boolean=true;
  userRole:string='';
  isRegionDisabled = false;
   isEditMode: boolean = false;
   selectedType: string ='sendAfterReminder';

 
  @Select(MessageState.getAllTemplate)
  getallTemplate$!: Observable<tempList>;


  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;


 constructor(
    private formBuilder: FormBuilder,
    private toaster: MessageService,
    private store: Store
 ) {
    this.templateConfigurationForm = this.formBuilder.group({
        type: ['sendAfterReminder', Validators.required],
       sendAt: ['', Validators.required],
      run: [false],
      id: [0],
      templateName: ['', Validators.required],
      templateID: [0],
         isReminder: ['sendAfterReminder', Validators.required], // Set default value
      isSendAfter: [null],
       sendAfterReminder: [null],
      sendAfter: [null],
      sendBefore: [null],
      gender: [null, Validators.required],
      regionID: [null, Validators.required],
      contentEn: [null, Validators.required],
      contentAr: [null, Validators.required],
          });
  }

 
  ngOnInit(): void {
    this.createConfigTemplate();
    this.subscribeToTemplateState();
    this.getAllTemplates();
    this.subscribeToRoleState();
  this.selectedType = 'sendAfterReminder'; // Set the default selected type
  this.updatePlaceholderAndValidators();
    this.breadCrumbItems = [{ label: 'Message' }, { label: 'Message Configuration', active: true }];

    this.englishDynamicContent = this.englishDynamicContent
      .replace('{{Name}}', 'Mohamed Ibrahim')
      .replace('{{date}}', '29 Feb 2024')
      .replace('{{time}}', '3pm');
    this.arabicdDynamicContent = this.arabicdDynamicContent
      .replace('{{Name}}', 'محمد ابراهيم')
      .replace('{{date}}', '29 Feb 2024')
      .replace('{{time}}', '3pm');
        document.getElementById('sendAfter')!.style.display = 'none';
this.templateConfigurationForm.get('isReminder')?.valueChanges.subscribe(value => {
  if (value) {
    this.onTypeChange({ target: { value: 'sendAfterReminder' } });
    
  }});
      this.onTypeChange({ target: { value: 'sendAfterReminder' } });
  }  
  onTypeChange(event: any): void {
    this.selectedType = event.target.value;
    this.updatePlaceholderAndValidators();
  }
   updatePlaceholderAndValidators(): void {
    const controls = this.templateConfigurationForm.controls;
    controls['sendAfterReminder'].setValidators(null);
    controls['sendAfter'].setValidators(null);
    controls['sendBefore'].setValidators(null);

    if (this.selectedType === 'sendAfterReminder') {
      controls['sendAfterReminder'].setValidators([Validators.required]);
    } else if (this.selectedType === 'sendAfter') {
      controls['sendAfter'].setValidators([Validators.required]);
    } else if (this.selectedType === 'sendBefore') {
      controls['sendBefore'].setValidators([Validators.required]);
    }

    controls['sendAfterReminder'].updateValueAndValidity();
    controls['sendAfter'].updateValueAndValidity();
    controls['sendBefore'].updateValueAndValidity();
  }

 
  
 
  submit() {
    this.showLoader = true;
    this.store.dispatch(new EditTemplateAction(this.templateConfigurationForm.value))
      .subscribe(
        (response) => {
          if (response) {
            this.disableAllInputs();
            this.showLoader = false;
                     // Reset the form fields
          this.templateConfigurationForm.reset();
          this.initializeForm(); // Optionally reinitialize to set defaults
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
  }

initializeForm() {
  this.templateConfigurationForm = this.formBuilder.group({
    type: ['sendAfterReminder', Validators.required],
    sendAt: ['', Validators.required],
    run: [false],
    id: [0],
    templateName: ['', Validators.required],
    templateID: [0],
    isReminder: ['sendAfterReminder', Validators.required],
    isSendAfter: [null],
    sendAfterReminder: [null],
    sendAfter: [null],
    sendBefore: [null],
    gender: [null, Validators.required],
    regionID: [null, Validators.required],
    contentEn: [null, Validators.required],
    contentAr: [null, Validators.required],
  });
}

  toggleEditconfig(status: boolean) {
    const formControls = this.templateConfigurationForm.controls;
    if (status && !this.isSelectDisabled) {
      Object.keys(formControls).forEach(controlName => {
        formControls[controlName].enable();
      });
 
 
    } else {
      this.toaster.add({ severity: 'error', summary: 'Error', detail: "You should Select Region and Template First !" });
      this.disableAllInputs();
    }
  }

   disableAllInputs() {
    const formControls = this.templateConfigurationForm.controls;
    Object.keys(formControls).forEach(controlName => {
      formControls[controlName].disable();
    });
  }

   isAllInputsDisabled(): boolean {
    const formControls = this.templateConfigurationForm.controls;
    for (const controlName in formControls) {
      if (controlName !== 'run' && formControls[controlName].enabled) {
        return false; // If any input is enabled, return false
      }
    }
    return true; // All inputs are disabled, return true
  }

  //select template

  onTemplateChange() {
        const selectedTemplate = this.templateDetailList.find(t => t.templateID === this.selectedTemplateID);
        if (selectedTemplate) {
          this.templateConfigurationForm.patchValue(selectedTemplate);
          this.isSelectDisabled = true;
          this.disableAllInputs();
        } else {
          this.isSelectDisabled = false;
          this.disableAllInputs();
        }
    const filtered = this.templateDetailList.find((template) => {
      return template.templateID == this.selectedTemplateID;
    });

    if (filtered) {
      this.templateConfigurationForm.patchValue(filtered);
    }
  }


  //Select Region
  onRegionChange() {
    this.isSelectDisabled = false;
    this.getallTemplate$.subscribe((response: any) => {
      if (response) {
        const allTemp = response as tempList[];
        this.templateDetailList = allTemp.filter((temp: tempList) => {
          return temp.regionID == +this.selectedregionID;
        });
      }
    });
  
    this.getRunTempList(this.selectedregionID);
    this.getSToppedTempList(this.selectedregionID);
  }

  // return all template
 getAllTemplates() {
    this.showLoader = true;
    this.store.dispatch(new GetAllTemplateAction)
      .subscribe(
        (response) => {
          if (response) {
            this.showLoader = false;
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
  }

  subscribeToTemplateState(){
    this.showLoader=true;
    this.getallTemplate$.subscribe((response:any) => {
      if (response) {
        this.templateDetailList=response as tempList[];
        this.showLoader=false;   
        this.getRunTempList(this.selectedregionID);
        this.getSToppedTempList(this.selectedregionID);
        }
    });
  }


  createConfigTemplate(templateModel?: tempConfig) {
    this.templateConfigurationForm = this.formBuilder.group({
      templateName: [{ value: templateModel?.templateName, disabled: true }],
      templateID: [{ value: templateModel?.templateID, disabled: true }],
      id: [{ value: templateModel?.id, disabled: true }],
      sendAt: [{ value: templateModel?.sendAt, disabled: true }, Validators.required],
      sendAfter: [{ value: templateModel?.sendAfter ?? '', disabled: true }, Validators.required],
      gender: [{ value: templateModel?.gender ?? '', disabled: true }, Validators.required],
      regionID: [{ value: templateModel?.regionID ?? '', disabled: true }, Validators.required],
      contentEn: [{ value: templateModel?.contentEn, disabled: true }, Validators.required],
      contentAr: [{ value: templateModel?.contentAr, disabled: true }, Validators.required],
      isReminder: [{ value: templateModel?.isReminder, disabled: true }],
      sendAfterReminder: [{ value: templateModel?.sendAfterReminder, disabled: true }, Validators.required],
      run: [{ value: templateModel?.run, disabled: true }],
      

    });
  }
  subscribeToRoleState() {
    this.getallTemplate$.subscribe((response: any) => {
      if (response) {
        const allTemp = response as tempList[];
        this.templateDetailList = allTemp;
      }
    });

  }
  patchConfigForm(templateModel: tempConfig) {
    this.templateConfigurationForm.patchValue({
      templateName: templateModel.templateName,
      templateID: templateModel.templateID,
      id: templateModel.id,
      sendAt: templateModel.sendAt,
      sendAfter: templateModel.sendAfter ?? '',
      gender: templateModel.gender ?? '',
      regionID: templateModel.regionID ?? '',
      contentEn: templateModel.contentEn,
      contentAr: templateModel.contentAr,
      isReminder: templateModel.isReminder,
      sendAfterReminder: templateModel.sendAfterReminder,
      run: templateModel.run,


 
    });

    this.toggleEditconfig(false);
  }

  getRunTempList(selectedregionID: number) {
    const runTemp = this.templateDetailList.filter((temp: tempList) => {
      return temp.run === true && temp.regionID == selectedregionID;
    });
    this.runTempList = runTemp;
  }
   getSToppedTempList(selectedregionID: number) {
    const stoppedTemp = this.templateDetailList.filter((temp: tempList) => {
      return temp.run === false && temp.regionID == selectedregionID;
    });
    this.stoppedTempList = stoppedTemp;
  }
  updateTemplateStatus(temp:tempConfig){
    this.showLoader=true;
    this.showLoader=true;
    temp.run=!temp.run
    this.store.dispatch(new updateTemplateStatusAction(temp))
      .subscribe(
        (response) => {
          if (response) {
            this.showLoader = false;
          }
        },
        (error) => {
          this.showLoader = false;
        });
  }
 

  handleChange(){
  alert("hello")
}
  getRole(role:string){
    if(role=='EgyptAdmin'){
      this.selectedregionID=1;
      this.isRegionDisabled=true
      this.onRegionChange();
    }
    else if(role=='KSAAdmin'){
      this.selectedregionID=2;
      this.isRegionDisabled=true
      this.onRegionChange();
    }
    else if(role=='UAEAdmin'){
      this.selectedregionID=3;
      this.isRegionDisabled=true
      this.onRegionChange();
    }
    else if(role=='Qatar'){
      this.selectedregionID=4;
      this.isRegionDisabled=true
      this.onRegionChange();
    }

  }

}
 
 