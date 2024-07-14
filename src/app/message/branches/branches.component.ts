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
 
  @Select(branchState.getbranches)
  getAllBranches$!: Observable<any>;

  @Select(branchState.getAreas)
  getAllAreas$!: Observable<any>;

  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;



 constructor(private http: HttpClient, private fb: FormBuilder,private formBuilder: FormBuilder, private store: Store) {
    this.addBranchForm = this.fb.group({
      regionID: ['', Validators.required],
      areaID: ['', Validators.required],
      name: ['', Validators.required],
      nameAr: ['', Validators.required],
      branchCode: ['', Validators.required],
      geoLocation: ['', Validators.required],
      googleReviewLink: ['', Validators.required],
      emailsAdmin: ['', Validators.required],
      mobilesAdmin: ['', Validators.required],
      sender: ['', Validators.required],
      portNum: ['', Validators.required],
      serverIP: ['', Validators.required],
      serverName: ['', Validators.required],
      uName: ['', Validators.required],
      pWord: ['', Validators.required],
      serviceProviderAccessToken: ['', Validators.required],
      spapiLink: ['', Validators.required],
      dbName: ['', Validators.required],
      allBranchList:  []  , // Initialize empty array or fetch initial data from service
      editMode : false

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
    return this.addBranchForm.get('emailsAdmin')!.value.split(',');
}
getPhonesArray(){
  return this.addBranchForm.get('mobilesAdmin')!.value.split(',');

}

addEmail(email: string): void {
    const currentEmails = this.addBranchForm.get('emailsAdmin')!.value;
    const updatedEmails = currentEmails ? `${currentEmails},${email}` : email;
    this.addBranchForm.get('emailsAdmin')!.setValue(updatedEmails);
    // Clear the input field after adding email
}
addPhone(phone: string): void {
  const currentPhones = this.addBranchForm.get('mobilesAdmin')!.value;
  const updatedPhones= currentPhones ? `${currentPhones},${phone}` : phone;
  this.addBranchForm.get('mobilesAdmin')!.setValue(updatedPhones);
  // Clear the input field after adding email
}
removeEmail(email: string): void {
    const currentEmails = this.addBranchForm.get('emailsAdmin')!.value.split(',');
    const updatedEmails = currentEmails.filter(e => e !== email).join(',');
    this.addBranchForm.get('emailsAdmin')!.setValue(updatedEmails);
}

removePhone(phone: string): void {
  const currentPhones = this.addBranchForm.get('mobilesAdmin')!.value.split(',');
  const updatedPhones = currentPhones.filter(e => e !== phone).join(',');
  this.addBranchForm.get('mobilesAdmin')!.setValue(updatedPhones);
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
      bearerT: [branchModel?.bearerT ?? '', [Validators.required]],
      areaID: [branchModel?.areaID ?? '', [Validators.required]],
      spapiLink: [branchModel?.spapiLink ?? '', [Validators.required]],
      sender: [branchModel?.sender ?? '', [Validators.required]],
      serverIP: [branchModel?.serverIP ?? '', [Validators.required]],
      emailsAdmin: [branchModel?.emailsAdmin ?? '', [Validators.required]],
      mobilesAdmin: [branchModel?.mobilesAdmin ?? '', [Validators.required]],
      serviceProviderAccessToken: [branchModel?.serviceProviderAccessToken ?? '', [Validators.required]],
      ipAddress: [branchModel?.ipAddress ?? '', [Validators.required]],
      serverName: [branchModel?.serverName ?? '', [Validators.required]],
      portNum: [branchModel?.portNum ?? '', [Validators.required]],
      apiLink: [branchModel?.apiLink ?? '', [Validators.required]],
      uName: [branchModel?.uName ?? '', [Validators.required]],
      pWord: [branchModel?.pWord ?? '', [Validators.required]],
      dbName: [branchModel?.dbName ?? '', [Validators.required]],
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

  if (this.editMode) {
    this.store.dispatch(new EditBranchAction(this.addBranchForm.value)).subscribe(
      (response) => {
        if (response) {
          showToast = true; 
          this.showLoader = false;
          this.reset();
          this.getAllBranchesList();
          this.subscribeToBranchesList(); 
          this.editMode = false; 
          window.location.reload(); // Force reload after successful update
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  } else {

    this.http.get<any[]>('http://service.themagsmen.com/api/DeactiveBranches').subscribe(
      (deactivatedBranches: any[]) => {
        if (deactivatedBranches && deactivatedBranches.length > 0) {
          const firstBranch = deactivatedBranches[0]; 
          
          this.addBranchForm.patchValue({
            regionID: firstBranch.regionID,
            areaID: firstBranch.areaID,
            bearerT: firstBranch.bearerT,
            id: firstBranch.id,
            apiLink: firstBranch.apiLink,
            ipAddress: firstBranch.ipAddress,
            name: firstBranch.name,
            nameAr: firstBranch.nameAr,
            branchCode: firstBranch.branchCode,
            geoLocation: firstBranch.geoLocation,
            googleReviewLink: firstBranch.googleReviewLink,
            emailsAdmin: firstBranch.emailsAdmin,
            mobilesAdmin: firstBranch.mobilesAdmin,
            sender: firstBranch.sender,
            portNum: firstBranch.portNum,
            serverIP: firstBranch.serverIP,
            serverName: firstBranch.serverName,
            uName: firstBranch.uName,
            pWord: firstBranch.pWord,
            serviceProviderAccessToken: firstBranch.serviceProviderAccessToken,
            spapiLink: firstBranch.spapiLink,
            dbName: firstBranch.dbName
          });


          this.store.dispatch(new AddNewBranchAction(this.addBranchForm.value)).subscribe(
            (response) => {
              if (response) {
                this.showLoader = false;
                this.getAllBranchesList(); 
                this.editMode = true; 
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
// submit() {
//   this.showLoader = true;
//   let showToast = false; // Initialize showToast flag

//   if (this.editMode) {
//     // Update existing branch
//     this.store.dispatch(new EditBranchAction(this.addBranchForm.value)).subscribe(
//       (response) => {
//         if (response) {
//           showToast = true; // Set showToast to true after successful update
//           this.showLoader = false;
//           this.reset();
//           this.getAllBranchesList(); // Refresh active branches list
//           this.subscribeToBranchesList(); // Subscribe to changes
//           this.editMode = false; // Reset editMode to false
//         }
//       },
//       (error) => {
//         this.showLoader = false;
//       }
//     );
//   } else {
//     // Add new branch (deactivated branch)
//     this.http.get<any[]>('http://service.themagsmen.com/api/DeactiveBranches').subscribe(
//       (deactivatedBranches: any[]) => {
//         if (deactivatedBranches && deactivatedBranches.length > 0) {
//           const firstBranch = deactivatedBranches[0]; // Get the first deactivated branch
          
//           // Patch form values with deactivated branch details
//           this.addBranchForm.patchValue({
//             regionID: firstBranch.regionID,
//             areaID: firstBranch.areaID,
//             bearerT: firstBranch.bearerT,
//             id: firstBranch.id,
//             apiLink: firstBranch.apiLink,
//             ipAddress: firstBranch.ipAddress,
//             name: firstBranch.name,
//             nameAr: firstBranch.nameAr,
//             branchCode: firstBranch.branchCode,
//             geoLocation: firstBranch.geoLocation,
//             googleReviewLink: firstBranch.googleReviewLink,
//             emailsAdmin: firstBranch.emailsAdmin,
//             mobilesAdmin: firstBranch.mobilesAdmin,
//             sender: firstBranch.sender,
//             portNum: firstBranch.portNum,
//             serverIP: firstBranch.serverIP,
//             serverName: firstBranch.serverName,
//             uName: firstBranch.uName,
//             pWord: firstBranch.pWord,
//             serviceProviderAccessToken: firstBranch.serviceProviderAccessToken,
//             spapiLink: firstBranch.spapiLink,
//             dbName: firstBranch.dbName
//           });

//           // Now dispatch action to add new branch
//           this.store.dispatch(new AddNewBranchAction(this.addBranchForm.value)).subscribe(
//             (response) => {
//               if (response) {
//                 this.showLoader = false;
//                 this.getAllBranchesList(); // Refresh active branches list
//                 this.editMode = true; // Set editMode back to true for next edit
//               }
//             },
//             (error) => {
//               this.showLoader = false;
//               console.error('Error adding new branch:', error);
//             }
//           );
//         } else {
//           // Handle case where no deactivated branches are found
//           this.showLoader = false;
//           console.log('No deactivated branches found.');
//         }
//       },
//       (error) => {
//         this.showLoader = false;
//         console.error('Error fetching deactivated branches:', error);
//       }
//     );
//   }

//   // Show toast conditionally based on showToast flag
//   setTimeout(() => {
//     if (showToast) {
//       // Display your toast message here
//       console.log('Toast shown after update');
//     }
//   }, 0); // Use setTimeout to ensure it runs after other operations
// }

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
    this.showLoader = true;
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
    this.editMode = false;
    emailsAdminInput.value = '';
    mobilesAdminInput.value = '';
  }

  editBranch(branch: any) {
    console.log("branchh", branch)
    this.updateBranchForm(branch);
    this.setBearerToken(branch.regionID);
    this.getAllAreasListById(branch.regionID)
    this.scrollToForm();
    this.editMode = true;
  }

  async updateBranchForm(branchModel?: createBranch) {
    // Then update the form values
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
      spapiLink: branchModel?.spapiLink ?? '',
      sender : branchModel?.sender ?? '',
      serverIP : branchModel?.serverIP ?? '',
 portNum      : branchModel?.portNum ?? '',
      nameAr: branchModel?.nameAr ?? '',
      bearerT: branchModel?.bearerT ?? '',
      pWord: branchModel?.pWord ?? '',
      dbName: branchModel?.dbName ?? '',
      uName: branchModel?.uName ?? '',

       
    });
  }

  scrollToForm() {
    if (this.targetForm && this.targetForm.nativeElement) {
      this.targetForm.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }



}
