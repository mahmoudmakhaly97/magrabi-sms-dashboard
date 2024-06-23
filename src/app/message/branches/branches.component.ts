import { Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent {
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

  @Select(branchState.getbranches)
  getAllBranches$!: Observable<any>;

  @Select(branchState.getAreas)
  getAllAreas$!: Observable<any>;

  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;



  constructor(private formBuilder: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Branches' }, { label: 'Add New Branch', active: true }];
    this.createBranchForm();
    this.subscribeToBranchesList();
    this.getAllBranchesList();
    this.subscribeToAreasList();
    this.subscribeToRoleState();

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
    if (this.editMode) {
      this.store.dispatch(new EditBranchAction(this.addBranchForm.value)).subscribe(
        (response) => {
          if (response) {
            this.showLoader = false;
            this.reset();
            this.getAllBranchesList()
            this.subscribeToBranchesList();
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }
    else {
      this.store.dispatch(new AddNewBranchAction(this.addBranchForm.value)).subscribe(
        (response) => {
          if (response) {
            this.showLoader = false;
            this.reset();
            this.getAllBranchesList()
            this.subscribeToBranchesList();
          }
        },
        (error) => {
          this.showLoader = false;
        }
      );
    }
    console.log(this.addBranchForm.value);


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
    this.addBranchForm.reset();
    this.editMode = false;
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
