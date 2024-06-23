import { Component, OnInit } from '@angular/core';
import { FileService } from '../services/file.service';
import { quickMessage, smsProviderModel } from '../models/quickMessage.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Select, Store } from '@ngxs/store';
import { smsProviderState } from '../state/quick-sms/quick-sms.state';
import { Observable } from 'rxjs';
import { PostSmsProviderAction } from '../state/quick-sms/quick-sms.action';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { AuthState } from 'src/app/autientication/state/auth.state';


@Component({
  selector: 'app-send-quick-message',
  templateUrl: './send-quick-message.component.html',
  styleUrls: ['./send-quick-message.component.scss']
})
export class SendQuickMessageComponent implements OnInit{
  // bread crumb items
  breadCrumbItems: Array<{}>;
  customers!: any[];

  selectedCountry:any='';
  activityValues: number[] = [0, 100];
  loading: boolean = false;
  isButtonDisabled:boolean=true;
  quickMessageForm: FormGroup;
  showLoader:boolean=false;
  userRole:string='';
  smsProvider:smsProviderModel;

  @Select(smsProviderState.getSmsProviderResonse)
  getSmsProviderResonse$!: Observable<quickMessage>;

  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;



  constructor(private fileService: FileService,
              private formBuilder:FormBuilder,
              private toaster: MessageService,
              private store:Store){}


  
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Sms' }, { label: 'Quick Sms', active: true }];
    this.createQuickMessage();
    this.subscribeSmsResponse();
    this.subscribeToRoleState();

  }

  subscribeSmsResponse(){
    this.getSmsProviderResonse$.subscribe((response:any) => {
      if (response) {
       console.log(response)     
        }
    });
  }
  subscribeToRoleState(){
    this.role$.subscribe((response:any) => {
    if (response) {
        this.userRole=response;
        this.getTokenRole(this.userRole)

    }
    else{
        const token=JSON.parse(localStorage.getItem('Token') || '{}')
        this.userRole=token.role
        this.getTokenRole(this.userRole)

    }

    });
  }

  getTokenRole(role: string): void {
    switch(role) {
    case 'EgyptAdmin':
        this.selectedCountry=1;
        this.onCountryChange();
        this.quickMessageForm.get('country')?.disable();
        this.smsProvider.token='449144056019f81b729d160a7ed5ce21';
        break;
    case 'KSAAdmin':
        this.selectedCountry=2;
        this.onCountryChange();
        this.quickMessageForm.get('country')?.disable();
        this.smsProvider.token='449144056019f81b729d160a7ed5ce21';
        break;
    case 'UAEAdmin':
        this.selectedCountry=3;
        this.onCountryChange();
        this.quickMessageForm.get('country')?.disable();
        this.smsProvider.token='449144056019f81b729d160a7ed5ce21';
        break;
    case 'Qatar':
        this.selectedCountry=4;
        this.onCountryChange();
        this.quickMessageForm.get('country')?.disable();
        this.smsProvider.token='449144056019f81b729d160a7ed5ce21';
        break;
    default:
        break;
    }
}
  onFileChange(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.fileService.extractNamesFromExcel(file)
        .then((data:any) => {
          // console.log('Extracted Names:', data.customers);
          this.customers=data.customers;
                
          switch (this.selectedCountry) {
            case '1':
              return this.checkSaudiList(this.customers);
            case '2':
              return this.checkEgyptList(this.customers);
            case '3':
              return this.checkUaeList(this.customers);
            case '4':
              return this.checkQatartList(this.customers);
            default:
              return false;
          }

        })
        .catch(error => {
          console.error('Error extracting data:', error);
        });
    }
  }

  createQuickMessage(messageModel?:quickMessage){
    this.quickMessageForm = this.formBuilder.group({
      country:[{value:messageModel?.country ?? ''},[Validators.required]],
      file:[{value:messageModel?.file,disabled:true},[Validators.required]],
      content:[{value:messageModel?.content,disabled:true},[Validators.required]],
      phoneNumberList:[]
    });
  }

  onCountryChange(){
    if(this.quickMessageForm.get('file')?.value){
      this.quickMessageForm.get('file')?.setValue(undefined)
      this.customers=[]
    }
    else{
      this.quickMessageForm.get('file')?.enable();
      this.quickMessageForm.get('content')?.enable();
    }

  }
  submit(){
    const allPhoneNumbers: string[] = this.customers.flatMap(customer => customer.phoneNumber);
    this.quickMessageForm.get('phoneNumberList')?.setValue(allPhoneNumbers)
      console.log(allPhoneNumbers);
      console.log( this.quickMessageForm.value)
      const scheduledDatetime=new Date();
      const smsProvider:smsProviderModel={
        content:{
          recipients:allPhoneNumbers,
          body: this.quickMessageForm.get('content')?.value,
          sender:"Taqnyat.sa",
          scheduledDatetime:scheduledDatetime.toISOString(),
        }

      }
      console.log(smsProvider)
      this.store.dispatch(new PostSmsProviderAction(smsProvider))
      .subscribe(
        (response) => {
          if (response) {
            // this.disableAllInputs();
            this.showLoader = false;
          }
        },
        (error) => {
          this.toaster.add({ severity: 'error', summary: 'Error', detail:error });
          this.showLoader = false;
        })
  



  }

   isValidSaudiNumber(phoneNumber: string): boolean {
    return phoneNumber.startsWith("(+966)") && phoneNumber.length==16;
  }
   isValidEgyptNumber(phoneNumber: string): boolean {
    return phoneNumber.startsWith("(+20)") && phoneNumber.length==15;
  }
   isValidQatarNumber(phoneNumber: string): boolean {
    return phoneNumber.startsWith("(+974)") && phoneNumber.length==14;
  }
   isValidUaeNumber(phoneNumber: string): boolean {
    return phoneNumber.startsWith("(+971)") && phoneNumber.length==15;
  }

  checkSaudiList(cutomerList){
    cutomerList.forEach((customer: any) => {
      const phoneNumbers = customer.phoneNumber;
  
      const isValidCustomer = phoneNumbers.every((phoneNumber: string) => {
        return this.isValidSaudiNumber(phoneNumber);
      });
  
      customer.valid = isValidCustomer;

      if (!isValidCustomer) {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: "There are invalid numbers in your uploaded file. Please check!" });
      }
    });
    this.disableSendButton(cutomerList)
  }
  // checkEgyptList(cutomerList){

  checkEgyptList(customerList) {
    customerList.forEach((customer: any) => {
      const phoneNumbers = customer.phoneNumber;
  
      const isValidCustomer = phoneNumbers.every((phoneNumber: string) => {
        return this.isValidEgyptNumber(phoneNumber);
      });
  
      customer.valid = isValidCustomer;

      if (!isValidCustomer) {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: "There are invalid numbers in your uploaded file. Please check!" });
      }
    });
    this.disableSendButton(customerList)
  }

  disableSendButton(customerList){
    this.isButtonDisabled = !customerList.every((customer: any) => customer.valid);
  }
  
  checkQatartList(cutomerList){
    cutomerList.forEach((customer: any) => {
      const phoneNumbers = customer.phoneNumber;
  
      const isValidCustomer = phoneNumbers.every((phoneNumber: string) => {
        return this.isValidQatarNumber(phoneNumber);
      });
  
      customer.valid = isValidCustomer;

      if (!isValidCustomer) {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: "There are invalid numbers in your uploaded file. Please check!" });
      }
    });
    this.disableSendButton(cutomerList)
  }


  checkUaeList(cutomerList){
    cutomerList.forEach((customer: any) => {
      const phoneNumbers = customer.phoneNumber;
  
      const isValidCustomer = phoneNumbers.every((phoneNumber: string) => {
        return this.isValidUaeNumber(phoneNumber);
      });
  
      customer.valid = isValidCustomer;

      if (!isValidCustomer) {
        this.toaster.add({ severity: 'error', summary: 'Error', detail: "There are invalid numbers in your uploaded file. Please check!" });
      }
    });
    this.disableSendButton(cutomerList)
  }

  reset(){
    this.quickMessageForm.reset();
  }
   


}
