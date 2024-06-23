import { Component } from '@angular/core';
import { tempList } from '../models/tempConfig.model';
import { Select, Store } from '@ngxs/store';
import { Observable, finalize } from 'rxjs';
import { GetAllTemplateAction } from '../state/template.action';
import { MessageState } from '../state/template.state';
import { UserState } from '../state/users/user.state';
import { userList } from '../models/user.model';
import { GetAppApprovalListAction, GetAppCancelListAction } from '../state/users/user.action';
import { PostSmsProviderAction } from '../state/quick-sms/quick-sms.action';
import { MessageService } from 'primeng/api';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { AuthState } from 'src/app/autientication/state/auth.state';
import { smsProviderModel } from '../models/quickMessage.model';

@Component({
  selector: 'app-template-queue',
  templateUrl: './template-queue.component.html',
  styleUrls: ['./template-queue.component.scss']
})
export class TemplateQueueComponent  {
  breadCrumbItems: Array<{}>;
  minutes: number = 0;
 
  showLoader:boolean=true;
  aprovalInterval:number;
  schduleTemplateModelAR:smsProviderModel={
    token:'449144056019f81b729d160a7ed5ce21',
    content:{
      recipients: [],
      body: '',
      sender: '',
      scheduledDatetime: ''
    }
  };
  schduleTemplateModelEN:smsProviderModel={
    token:'449144056019f81b729d160a7ed5ce21',
    content:{
      recipients: [],
      body: '',
      sender: '',
      scheduledDatetime: ''
    }
  };

  @Select(MessageState.getAllTemplate)
  getallTemplate$!: Observable<tempList>;

  allTemplateList:tempList[];

  @Select(UserState.getAllUserList)
  getalluserList$!: Observable<tempList>;

  userList:userList[];
  arabicPhoneNumbers: any;
  englishPhoneNumbers: any;

  allUserList:any=[];
  selectedregionID:number;
  
  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;

  userRole:string;

  constructor(private store:Store,private toaster: MessageService){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Message' }, { label: 'Template Queue', active: true }];
    this.subscribeToTemplateState();
    this.subscribeToRoleState();
    this.getAllTemplates();
    this.getAllTemplateUserList();
    // this.allTemplateList.forEach((template) => {
    //   this.startCountdown(template?.sendAfter);
    // });

  } 
  startCountdown(minutes:number) {
    const countdownInterval = setInterval(() => {
      if (minutes <= 0) {
        clearInterval(countdownInterval);
      } else {
        this.minutes=minutes
        this.minutes--;
      }
    }, 60000); // Update every minute
  }

    // return all template
    getAllTemplates(){
      this.showLoader=true;
      this.store.dispatch(new GetAllTemplateAction )
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
  
    subscribeToTemplateState(){
      this.getallTemplate$.subscribe((response:any) => {
        if (response) {
          if(this.selectedregionID!=0){
            this.allTemplateList=response.filter((template)=>{return (template.regionID===this.selectedregionID)})
            console.log(this.allTemplateList)

          }
          else{this.allTemplateList=response as tempList[];}

          
          this.showLoader=false;   
          this.subscribeToUserListState();
          }
      });


    }
  
    subscribeToUserListState(){
      debugger
      this.getalluserList$.subscribe((response:any) => {
        console.log(response)
        if(response.cancelUserList && response.approvalUserList){
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              // Access the value using response[key]
              const value = response[key];      
              if (Array.isArray(value)) {
                for (const item of value) {
                  console.log(`Item in array: `, item);
                  this.allUserList.push(item)
                }
              }
            }
          }
          
        if(this.selectedregionID !=0){
          this.allTemplateList=this.allTemplateList.map((temp)=>{
            const filteredUserList=this.allUserList.filter((user)=>{return ((user.regionId==temp.regionID&& user.regionId === this.selectedregionID )&& user.templateId===temp.templateID)})
            return{
              ...temp,
              userList:filteredUserList
            }
          })   
        }
        else{
          this.allTemplateList=this.allTemplateList.map((temp)=>{
            const filteredUserList=this.allUserList.filter((user)=>{return ((user.regionId==temp.regionID)&& user.templateId===temp.templateID)})
            return{
              ...temp,
              userList:filteredUserList
            }
          })   
        }
        }


        this.showLoader=false;   
        // console.log(this.allUserList)
      });
    }


    subscribeToRoleState(){
      this.role$.subscribe((response:any) => {
        if (response) {this.userRole=response;this.getRole(this.userRole) }
        else{
          const token=JSON.parse(localStorage.getItem('Token') || '{}')
          this.userRole=token.role
          this.getRole(this.userRole)
        }
  
      });
    }

    getRole(role:string){
      if(role=='EgyptAdmin'){
        this.selectedregionID=1;
      }
      else if(role=='KSAAdmin'){
        this.selectedregionID=2;
      }
      else if(role=='UAEAdmin'){
        this.selectedregionID=3;
      }
      else if(role=='Qatar'){
        this.selectedregionID=4;
      }
      else{ this.selectedregionID=0;}
  
    }

    // get App Approval List
    getAppApprovalList(){
      this.showLoader=true;
      this.store.dispatch(new GetAppApprovalListAction )
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

    // get App Cancel List
    getAppCancelList(){
      this.showLoader=true;
      this.store.dispatch(new GetAppCancelListAction )
      .subscribe(
        (response) => {
          if (response) {
            this.showLoader = false;
            console.log(response)
          }
        },
        (error) => {
          this.showLoader = false;
        });
    }

    //get all template
    getAllTemplateUserList(){
      this.getAppApprovalList();
      this.getAppCancelList();
    }


    schduleTemplate(templateId:number,regionID:number){
      if(templateId==1){
        // this.getAppApprovalList();
        const filteredUserList=this.allTemplateList.filter((temp)=>{return (temp.templateID==templateId)});
        console.log(filteredUserList)
        console.log(this.allTemplateList)
        this.setContetLanguageAndUser(filteredUserList[0].userList);
        const sendAt=filteredUserList[0].sendAt;
        const sendAfter=+filteredUserList[0].sendAfter;
        const sendAtDate = new Date(sendAt);
        sendAtDate.setMinutes(sendAtDate.getMinutes() + sendAfter);
        const formattedDatetime = sendAtDate.toISOString().slice(0, 16);

        // const userPhoneNumbers=filteredUserList.map((user)=>{return user.userList?.map(user => user.pbpttl)})[0]
        // console.log("user send date"+sendAt,"user send after date"+sendAt)
        // console.log(sendAtDate)
        // console.log(formattedDatetime)
        // console.log(userPhoneNumbers)
        if( this.arabicPhoneNumbers){
          this.setSmsProviderTemplateAR(this.arabicPhoneNumbers,filteredUserList[0].contentAr,"",formattedDatetime )
        }
        if( this.englishPhoneNumbers){
          this.setSmsProviderTemplateEN(this.englishPhoneNumbers,filteredUserList[0].contentEn,"",formattedDatetime )
        }

      }

    }  

    //Set service provider object of arabic version
    setSmsProviderTemplateAR(recipients:any,body:string,sender:string,scheduledDatetime:string,deleteId?:number){
      this.schduleTemplateModelAR.content.recipients=recipients;
      this.schduleTemplateModelAR.content.body=body;
      this.schduleTemplateModelAR.content.sender=sender;
      this.schduleTemplateModelAR.content.scheduledDatetime=scheduledDatetime,
      this.schduleTemplateModelAR.content.deleteId=deleteId;
      console.log(this.schduleTemplateModelAR)
      this.callServiceProvider(this.schduleTemplateModelAR)
    }

    //Set service provider object of english version
    setSmsProviderTemplateEN(recipients:any,body:string,sender:string,scheduledDatetime:string,deleteId?:number){
      this.schduleTemplateModelEN.content.recipients=recipients;
      this.schduleTemplateModelEN.content.body=body;
      this.schduleTemplateModelEN.content.sender=sender;
      this.schduleTemplateModelEN.content.scheduledDatetime=scheduledDatetime,
      this.schduleTemplateModelEN.content.deleteId=deleteId;
      console.log(this.schduleTemplateModelEN)
      this.callServiceProvider(this.schduleTemplateModelEN)

    }

    // Assuming userList is your array of objects
    setContetLanguageAndUser(userList:any){
      this.arabicPhoneNumbers = userList
      .filter((user) => user.lang.trim().toUpperCase() === 'AR')
      .map((arabicUser) => arabicUser.pbpttl.trim());

      this.englishPhoneNumbers = userList
      .filter((user) => user.lang.trim().toUpperCase() === 'EN')
      .map((englishUser) => englishUser.pbpttl.trim());
    }

    //call service
    callServiceProvider(smsModel:smsProviderModel){
      this.showLoader=true;
      this.toaster.add({ severity: 'success', summary: 'Success', detail: "Queue Template Schdulled Sucessfully" });
      this.store.dispatch(new PostSmsProviderAction(smsModel) )
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


}
