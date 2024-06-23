import { Component, OnInit } from '@angular/core';
import { ChartType } from '../../models/chart.model';
import { SmsState } from '../../state/smsprovider.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetStatisticsAction } from '../../state/smsprovider.action';
import { MessageService } from 'primeng/api';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { AuthState } from 'src/app/autientication/state/auth.state';
import { UserState } from 'src/app/message/state/users/user.state';
import { GetAllUserAction } from 'src/app/users/state/user.action';
import { branchState } from 'src/app/message/state/branches/branches.state';
import { GetAllAreasAction, GetAllBranchesAction, GetBranchByIdAction } from 'src/app/message/state/branches/branches.action';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  // Bar Chart
  lineBarChart: ChartType;
  pieChart:ChartType;
  lineAreaChart: ChartType;
  breadCrumbItems: Array<{}>;
  showLoader:boolean;
  @Select(SmsState.getSmsStatics)
  getSmsStaticsResonse$!: Observable<any>;
  bearerToken:string='449144056019f81b729d160a7ed5ce21';
  userRole:string='';
  dataObject:any;
  allUserList:any=[];
  allList:any=[];
  allBranchList:any=[];
  allAreaList:any=[];
  getAnalyticForm:FormGroup;
  selectedregionID:any='';
  selectedAreaID:any='';
  selectedBranchID:any='';
  showFilter:Boolean=true;


  
  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;

  @Select(UserState.getAllUserList)
  getAllUser$!: Observable<any>;

  @Select(branchState.getbranches)
  getAllBranches$!: Observable<any>;



  constructor(private store:Store,private toaster:MessageService,private formBuilder:FormBuilder){}
    pieChartModel: ChartType = {
    labels: [
        'Egypt', 'Qatar'
    ],
    datasets: [
        {
            data: [300, 180],
            backgroundColor: ['rgb(114, 102, 187)', '#ebeff2'],
            hoverBackgroundColor: ['rgb(114, 102, 187)', '#ebeff2'],
            hoverBorderColor: '#fff',
        }
    ],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        }
    }
    };
  
    ngOnInit(): void {
    this._fetchData();
    this.breadCrumbItems = [{ label: 'Account' }, { label: 'dashboard', active: true }];
    this.createBranchForm();
    this.subscribeToRoleState();
    this.subscribeToAllUserList();
    this.getAllUserList();
    this.getAllBranchesList();
    this.subscribeToBranchesList();

    }

    private _fetchData() {
    this.pieChart = this.pieChartModel;
    }

    getStatistics(){
        this.showLoader=true;
        this.store.dispatch(new GetStatisticsAction(this.bearerToken))
        .subscribe(
        (response) => {
            if (response.smsState) {
            // this.disableAllInputs();
            this.dataObject=response.smsState.value 
            this.showLoader = false;
            }
        },
        (error) => {
            this.showLoader = false;

        })
    }
    subscribeSmsResponse(){
        this.getSmsStaticsResonse$.subscribe((response:any) => {
        if (response) {
            this.dataObject=response.smsState.value
            }
        });
    }
    subscribeToRoleState(){
        this.role$.subscribe((response:any) => {
        if (response) {
            this.userRole=response;
            this.getTokenRole(this.userRole)
            this.subscribeSmsResponse();
            this.getStatistics();
        }
        else{
            const token=JSON.parse(localStorage.getItem('Token') || '{}')
            this.userRole=token.role
            this.getTokenRole(this.userRole);
            this.subscribeSmsResponse();
            this.getStatistics();
        }

        });
    }
    getTokenRole(role: string): void {
        switch(role) {
        case 'EgyptAdmin':
            this.selectedregionID=1;
            this.onRegionChange();
            this.getAnalyticForm.get('regionID')?.disable();
            break;
        case 'KSAAdmin':
            this.selectedregionID=2;
            this.onRegionChange();
            this.getAnalyticForm.get('regionID')?.disable();
            break;
        case 'UAEAdmin':
            this.selectedregionID=3;
            this.onRegionChange();
            this.getAnalyticForm.get('regionID')?.disable();
            break;
        case 'Qatar':
            this.selectedregionID=4;
            this.onRegionChange();
            this.getAnalyticForm.get('regionID')?.disable();
            break;
        default:
            break;
        }
    }
    subscribeToAllUserList(){
        this.getAllUser$.subscribe((response:any) => {
        if (response && response?.addUserState) {
            this.allUserList=response?.addUserState['userList']; 
            }
        });
    }
    // return all user
    getAllUserList(){
      this.showLoader=true;
      this.store.dispatch(new GetAllUserAction )
      .subscribe(
        (response) => {
          if (response) {
            this.allUserList=response.addUserState['userList']; 
            console.log(this.allUserList)
            this.showLoader = false;
          }
        },
        (error) => {
          this.showLoader = false;
        });
      
    
    }
    // return all Branches
    getAllBranchesList(){
        this.showLoader=true;
        this.store.dispatch(new GetAllBranchesAction )
        .subscribe(
            (response) => {
            if (response && response?.branchState.branchModelResponse) {
                // this.allBranchList=response.branchState.branchModelResponse
                this.showLoader = false;
                if(this.userRole!='SuperAdmin'){
                    const branches=response.branchState.branchModelResponse;
                    this.allBranchList = branches.filter(branch => branch.regionID === this.selectedregionID);
                  }
                  else{
                    this.allBranchList=response.branchState.branchModelResponse;
                    this.showLoader = false;
                  }
            }
            },
            (error) => {
            this.showLoader = false;
            });
        
        } 
    subscribeToBranchesList(){
        this.getAllBranches$.subscribe((response:any) => {
            if (response) {
            if(this.userRole!='SuperAdmin'){
                const branches=response;
                this.allBranchList = branches.filter(branch => branch.regionID === this.selectedregionID);
              }
              else{
                this.allBranchList=response
                this.showLoader = false;
              }
            }
        });
        }

    createBranchForm(branchModel?:any){
        this.getAnalyticForm=this.formBuilder.group({
            regionID:[branchModel?.regionID ?? '',[Validators.required]],
            areaID:[{value:branchModel?.areaID ?? '', disabled: true },[Validators.required]],
            branchID:[{value:branchModel?.branchID ?? '', disabled: true },[Validators.required]],
        })
    }

    setBearerToken(regionID:number){
        if(regionID==1) this.bearerToken='449144056019f81b729d160a7ed5ce21';
        else if(regionID==2)  this.bearerToken='449144056019f81b729d160a7ed5ce21';
        else if(regionID==3)  this.bearerToken='449144056019f81b729d160a7ed5ce21';
        else if(regionID==4)  this.bearerToken='449144056019f81b729d160a7ed5ce21';

    }
        
    onRegionChange(){
        this.setBearerToken(this.selectedregionID)
        // this.getAnalyticForm.patchValue({ regionID:this.selectedregionID})
        this.getAnalyticForm.get('regionID')?.setValue(this.selectedregionID)
        this.getAllAreasListById(this.selectedregionID)
        this.getAnalyticForm.get('areaID')?.enable();    
     }

    onAreaChange(){
        this.getAnalyticForm.patchValue({ areaID:this.selectedAreaID})
        this. getAllBranchListById(this.selectedAreaID);
        this.getAnalyticForm.get('branchID')?.enable();    

    } 

    onBranchChange(){
        this.getAnalyticForm.patchValue({ branchId:this.selectedBranchID})
        console.log(this.getAnalyticForm.value)
        this.getBearerTokenOfBranch(this.selectedBranchID)
    } 

    getBearerTokenOfBranch(branchId: number) {
        const branch = this.allBranchList.find(branch => branch.id === Number(branchId));
        this.bearerToken=branch.bearerT;
    }
    
    
    
    getAllBranchListById(areaID:number){
        this.showLoader=true;
        this.store.dispatch(new GetBranchByIdAction(areaID) )
        .subscribe(
            (response) => {
            if (response && response?.branchState.branchByIdList) {
                this.allBranchList=response?.branchState.branchByIdList;
                this.showLoader = false;
            }
            console.log(response)
            },
            (error) => {
            this.showLoader = false;
            });
        
        }

    getAllAreasListById(regionID:number){
        this.showLoader=true;
        this.store.dispatch(new GetAllAreasAction(regionID) )
        .subscribe(
            (response) => {
                console.log(response)
            if (response && response?.branchState.areaList) {
              this.allAreaList=response?.branchState?.areaList
              this.showLoader = false;
            }
            console.log(this.allAreaList)
            },
            (error) => {
            this.showLoader = false;
            });
        
        }  
         
    submit(){
    this.getStatistics();
    }    
    

  



}


