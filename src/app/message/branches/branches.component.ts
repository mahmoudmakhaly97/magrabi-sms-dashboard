import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createBranch } from '../models/branch.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddUserAction, GetAllUserAction } from 'src/app/users/state/user.action';
import { UserState } from '../state/users/user.state';
import { branchState } from '../state/branches/branches.state';
import { AddNewBranchAction, EditBranchAction, GetAllAreasAction, GetAllBranchesAction } from '../state/branches/branches.action';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { AuthState } from 'src/app/autientication/state/auth.state';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  @ViewChild('targetForm') targetForm: ElementRef;

  breadCrumbItems: Array<{}>;
  selectedCountry: string = 'Egypt';
  users: any = [];
  showLoader: boolean = false;
  addBranchForm: FormGroup;
  selectedregionID: any = '';
  selectedAreaID: any = '';
  allBranchList: any = [];
  allAreasList: any = [];
  editMode: boolean = false;
  userRole: string = '';
  deactivatedBranches: any[] = []; 
  dbName: string = '';
  spapiLink: string = '';
  sender: string = '';
  bearerT: string = '';
    @ViewChild('newEmail') newEmail!: ElementRef;
    @ViewChild('newPhone') newPhone!: ElementRef;
 
     emailMessage: string = '';
    phoneMessage: string = '';
    currentEmails: string[] = [];
    currentPhones: string[] = [];

 

   @Select(branchState.getbranches)
  getAllBranches$!: Observable<any>;

  @Select(branchState.getAreas)
  getAllAreas$!: Observable<any>;

  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;
  showToast: boolean;



 constructor(private http: HttpClient, private fb: FormBuilder,private formBuilder: FormBuilder, private store: Store) {
    this.addBranchForm = this.fb.group({
      id: [''],
      areaID: ['', Validators.required],
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      branchCode: ['', Validators.required],
      googleReviewLink: ['', Validators.required],
    emailsAdmin: [''], // Initialize with an empty string
            mobilesAdmin: [''] , 
      geoLocation: ['', Validators.required],
      regionID: ['', Validators.required],
       sender: ['', Validators.required],
      portNum: ['', Validators.required],
      serverIP: ['', Validators.required],
      serverName: ['', Validators.required],
      uName: ['', Validators.required],
      pWord: ['', Validators.required],
      dbName: ['', Validators.required],
      bearerT: ['', Validators.required],
      spapiLink: ['', Validators.required],
      active: [true, Validators.required], 
      

       allBranchList:  []  , // Initialize empty array or fetch initial data from service
      editMode: false, 
    
     });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Branches' }, { label: 'Add New Branch', active: true }];
    this.createBranchForm();
    this.subscribeToBranchesList();
    this.getAllBranchesList();
    this.subscribeToAreasList();
    this.subscribeToRoleState();

  }
 

 
     getEmailsArray(): string[] {
        return this.currentEmails;
    }

    getPhonesArray(): string[] {
        return this.currentPhones;
    }    addEmail(email: string): void {
        const trimmedEmail = email.trim();
        
        if (trimmedEmail && !this.currentEmails.includes(trimmedEmail)) {
            this.currentEmails.push(trimmedEmail); // Append new email
            this.emailMessage = `'${trimmedEmail}' has been added.`; // Success message
        } else if (this.currentEmails.includes(trimmedEmail)) {
            this.emailMessage = `'${trimmedEmail}' is already in the list.`; // Duplicate message
        } else {
            this.emailMessage = 'Please enter a valid email.'; // Empty input message
        }

        // Clear the input field
        this.newEmail.nativeElement.value = '';
    }
       updateEmailsAndPhones(): void {
        // Set the form control values to include all emails and phones
        this.addBranchForm.get('emailsAdmin')!.setValue(this.currentEmails.join(',')); // Update form control
        this.addBranchForm.get('mobilesAdmin')!.setValue(this.currentPhones.join(',')); // Update form control

        // Optionally, you can show a message or handle success here
        this.emailMessage = 'Emails and phones updated successfully.'; // Success message
    }

    removeEmail(email: string): void {
        this.currentEmails = this.currentEmails.filter(e => e !== email); // Remove email
    }

    removePhone(phone: string): void {
        this.currentPhones = this.currentPhones.filter(p => p !== phone); // Remove phone
    }
 
   addPhone(phone: string): void {
        const trimmedPhone = phone.trim();
        
        if (trimmedPhone && !this.currentPhones.includes(trimmedPhone)) {
            this.currentPhones.push(trimmedPhone); // Append new phone
            this.phoneMessage = `'${trimmedPhone}' has been added.`; // Success message
        } else if (this.currentPhones.includes(trimmedPhone)) {
            this.phoneMessage = `'${trimmedPhone}' is already in the list.`; // Duplicate message
        } else {
            this.phoneMessage = 'Please enter a valid phone number.'; // Empty input message
        }

        // Clear the input field
        this.newPhone.nativeElement.value = '';
    }
 

   
  subscribeToRoleState() {
    this.role$.subscribe((response: any) => {
      if (response) {
        this.userRole = response;
        this.getTokenRole(this.userRole)

      }
      else {
        const token = JSON.parse(localStorage.getItem('Token') || '{}')
        this.userRole = token.role
        this.getTokenRole(this.userRole)

      }

    });
  }

  getTokenRole(role: string): void {
    switch (role) {
      case 'EgyptAdmin':
        this.selectedregionID = 1;
        this.onRegionChange();
        this.addBranchForm.get('regionID')?.disable();
        break;
      case 'KSAAdmin':
        this.selectedregionID = 2;
        this.onRegionChange();
        this.addBranchForm.get('regionID')?.disable();
        break;
      case 'UAEAdmin':
        this.selectedregionID = 3;
        this.onRegionChange();
        this.addBranchForm.get('regionID')?.disable();
        break;
      case 'Qatar':
        this.selectedregionID = 4;
        this.onRegionChange();
        this.addBranchForm.get('regionID')?.disable();
        break;
      default:
        break;
    }
  }
  createBranchForm(branchModel?: createBranch) {
    this.addBranchForm = this.formBuilder.group({
       id: [branchModel?.id ?? ''],
      name: [branchModel?.name ?? '', [Validators.required]],
      nameAr: [branchModel?.nameAr ?? '', [Validators.required]],
      branchCode: [branchModel?.branchCode ?? '', [Validators.required]],
      geoLocation: [branchModel?.geoLocation ?? '', [Validators.required]],
      googleReviewLink: [branchModel?.googleReviewLink ?? '', [Validators.required]],
      regionID: [branchModel?.regionID ?? '', [Validators.required]],
      sender: [branchModel?.sender ?? '', [Validators.required]],
      serverName: [branchModel?.serverName ?? '', [Validators.required]],
      portNum: [branchModel?.portNum ?? '', [Validators.required]],
      uName: [branchModel?.uName ?? '', [Validators.required]],
      pWord: [branchModel?.pWord ?? '', [Validators.required]],
      dbName: [branchModel?.dbName ?? '', [Validators.required]],
      active: [branchModel?.active ?? '', [Validators.required]],
      bearerT: [branchModel?.bearerT ?? '', [Validators.required]],
      spapiLink: [branchModel?.spapiLink ?? '', [Validators.required]],
      emailsAdmin: [branchModel?.emailsAdmin ?? '', [Validators.required]],
      mobilesAdmin: [branchModel?.mobilesAdmin ?? '', [Validators.required]],
      serverIP: [branchModel?.serverIP ?? '', [Validators.required]],
       })
  }

  setBearerToken(regionID: number) {
    if (regionID == 1) this.addBranchForm.patchValue({ bearerT: '' })
    else if (regionID == 2) this.addBranchForm.patchValue({ bearerT: '449144056019f81b729d160a7ed5ce21' })
    else if (regionID == 3) this.addBranchForm.patchValue({ bearerT: '' })
    else if (regionID == 4) this.addBranchForm.patchValue({ bearerT: '' })

  }

  passwordVisible: boolean = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  onRegionChange() {
    this.setBearerToken(this.selectedregionID)
    this.addBranchForm.patchValue({ regionID: this.selectedregionID })
    this.getAllAreasListById(this.selectedregionID)
  }

  onAreaChange() {
    this.addBranchForm.patchValue({ areaID: this.selectedAreaID })
  }
submit() {
  this.showLoader = true;
  let showToast = false;

  const branchData = this.addBranchForm.value;
 
  if (this.editMode) {
   
    this.store.dispatch(new EditBranchAction(branchData)).subscribe(

      (response) => {
        if (response) {
          showToast = true; 
          this.showLoader = false;
          this.reset();
           this.editMode = false;
                  this.getAllBranchesList();

          
          //  window.location.reload();

          
        }
       },
      (error) => {
        this.showLoader = false;
        console.error('Error updating branch:', error);
      }
    );
  } else {
    // Logic for adding new branch
    this.http.get<any[]>('http://service.themagsmen.com/api/DeactiveBranches').subscribe(
      (deactivatedBranches: any[]) => {
        if (deactivatedBranches && deactivatedBranches.length > 0) {
          const firstBranch = deactivatedBranches[0];
          this.addBranchForm.patchValue({
       id: firstBranch.id,
            name: firstBranch.name,
            nameAr: firstBranch.nameAr,
            branchCode: firstBranch.branchCode,
            geoLocation: firstBranch.geoLocation,
            googleReviewLink: firstBranch.googleReviewLink,
            regionID: firstBranch.regionID,
            sender: firstBranch.sender,
            serverName: firstBranch.serverName,
            portNum: firstBranch.portNum,
            uName: firstBranch.uName,
            pWord: firstBranch.pWord,
            dbName: firstBranch.dbName,
            active: firstBranch.active,
            bearerT: firstBranch.bearerT,
            spapiLink: firstBranch.spapiLink,
            areaID: firstBranch.areaID,
            emailsAdmin: firstBranch.emailsAdmin,
            mobilesAdmin: firstBranch.mobilesAdmin,
            serverIP: firstBranch.serverIP,

          });

  



          this.store.dispatch(new AddNewBranchAction(branchData)).subscribe(
            (response) => {
              if (response) {
                this.showLoader = false;
                this.getAllBranchesList();
                this.editMode = true; // Set editMode for future edits
              }
            },
            (error) => {
              this.showLoader = false;
              console.error('Error adding new branch:', error);
            }
          );
        } else {
          this.showLoader = false;
          console.log('No deactivated branches found.');
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error fetching deactivated branches:', error);
      }
    );

  }

  setTimeout(() => {
    if (showToast) {
      console.log('Toast shown after update');
    }
  }, 0);
}

updateButtonText(text: string) {
  const submitButton = document.getElementById("btnSubmit");
  if (submitButton) {
    submitButton.innerText = text;
  }
}
 
  subscribeToBranchesList() {
    this.getAllBranches$.subscribe((response: any) => {
      if (response) {
        this.allBranchList = response
      }
    });
  }
  subscribeToAreasList() {
    this.getAllAreas$.subscribe((response: any) => {
      if (response) {
        this.allAreasList = response
        console.log(response)
      }
    });
  }

  // return all Branches
  getAllBranchesList() {
    this.showLoader = false;
    this.store.dispatch(new GetAllBranchesAction)
      .subscribe(
        (response) => {
          if (response && response?.branchState) {
            if (this.userRole != 'SuperAdmin') {
              const branches = response.branchState.branchModelResponse;
              this.allBranchList = branches.filter(branch => branch.regionID === this.selectedregionID);
            }
            else {
              this.allBranchList = response.branchState.branchModelResponse
              this.showLoader = false;
            }

          }
        },
        (error) => {
          this.showLoader = false;
        });

  }

  getAllAreasListById(regionID: number) {
    this.showLoader = true;
    this.store.dispatch(new GetAllAreasAction(regionID))
      .subscribe(
        (response) => {
          if (response && response?.branchState.areaList) {
            this.allAreasList = response?.branchState.areaList
            this.showLoader = false;
          }
          console.log(response)
        },
        (error) => {
          this.showLoader = false;
        });

  }

  reset() {
      const emailsAdminInput = document.getElementById('emails') as HTMLInputElement;
  const mobilesAdminInput = document.getElementById('phones') as HTMLInputElement;
    this.addBranchForm.reset();
    this.editMode = true;
    emailsAdminInput.value = '';
    mobilesAdminInput.value = '';
  }

  editBranch(branch: any) {
      
    
     this.showToast = true;
  this.updateBranchForm(branch);
  this.setBearerToken(branch.regionID);
  this.getAllAreasListById(branch.regionID);
  this.scrollToForm();
  this.editMode = true;
  this.updateBranchForm(branch); // Ensure this has the updated values
  this.setBearerToken(branch.regionID);
  this.getAllAreasListById(branch.regionID);
  this.scrollToForm();
  }

async updateBranchForm(branchModel?: createBranch) {
     this.addBranchForm.patchValue({
       id: branchModel?.id ?? '',
      regionID: branchModel?.regionID ?? '',
      areaID: branchModel?.areaID ?? '',
      name: branchModel?.name ?? '',
      branchCode: branchModel?.branchCode ?? '',
      geoLocation: branchModel?.geoLocation ?? '',
      googleReviewLink: branchModel?.googleReviewLink ?? '',
      emailsAdmin: branchModel?.emailsAdmin ?? '',
      mobilesAdmin: branchModel?.mobilesAdmin ?? '',
      sender: branchModel?.sender ?? '',
      portNum: branchModel?.portNum ?? '',
      nameAr: branchModel?.nameAr ?? '',
      pWord: branchModel?.pWord ?? '',
      dbName: branchModel?.dbName ?? '',
      uName: branchModel?.uName ?? '',
      serverName: branchModel?.serverName ?? '',
      bearerT: branchModel?.bearerT ?? '',
      spapiLink: branchModel?.spapiLink ?? '',
      active: branchModel?.active ?? '',
      serverIP: branchModel?.serverIP ?? '',
    });
    console.log('Form values after patching:', this.addBranchForm.value);
}


  scrollToForm() {
    if (this.targetForm && this.targetForm.nativeElement) {
      this.targetForm.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }



}
