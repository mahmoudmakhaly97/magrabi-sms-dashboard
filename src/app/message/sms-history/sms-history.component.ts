import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { historyStatus, templatView } from '../models/history.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { createBranch } from '../models/branch.model';
import { filterModel } from '../models/filter.model';
import { Observable, map } from 'rxjs';
import { GetAllAreasAction, GetBranchByIdAction } from '../state/branches/branches.action';
import { branchState } from '../state/branches/branches.state';
import { tempList } from '../models/tempConfig.model';
import { GetAllTemplateAction } from '../state/template.action';
import { MessageState } from '../state/template.state';
import { historyState } from '../state/filter-history/filter-history.state';
import { FilterHistoryAction } from '../state/filter-history/filter-history.action';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { AuthState } from 'src/app/autientication/state/auth.state';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-sms-history',
  templateUrl: './sms-history.component.html',
  styleUrls: ['./sms-history.component.scss']
})
export class SmsHistoryComponent {
  breadCrumbItems: Array<{}>;
  statuses:historyStatus[];
  selectedStatus!:historyStatus[];
  templates:templatView[];
  selectedTemplate!:templatView[];
  allBranchList:any=[];
  allAreaList:any=[];
  filterResult:any;
  historyFilterForm:FormGroup;
  showLoader:boolean=false;
  selectedregionID:any='';
  selectedAreaID:any='';
  selectedBranchID:any='';
  bearerToken:string='';
  templateDetailList:tempList[];
  formFilterModel:filterModel;
  @ViewChild('table') table: ElementRef;
  userRole:string='';
  noHistory:boolean=false;
  originalFilterResult:any;
  rows: number = 10; 
  first: number = 0; 
  totalCost:number=0;
  totalCount:number=0;



  @Select(branchState.getbranches)
  getAllBranches$!: Observable<any>;

  @Select(MessageState.getAllTemplate)
  getallTemplate$!: Observable<tempList>;

  @Select(historyState.getFilterResponse)
  getFilterResponse$!: Observable<filterModel>;

  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;



  constructor(private formBuilder:FormBuilder,private store:Store,
               private toaster:MessageService){}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Sms' }, { label: 'History', active: true }];
    this.initStatuses();
    this.createFilterForm();
    this.subscribeToTemplateState();
    this.getAllTemplates();
    this.subscribeToRoleState();
    // this.subscribeToFilterState();
  }  

  initStatuses(){
    this.statuses = [
      {name: 'Dlivered', value:true},
      {name: 'UnDlivered', value: true},
  ];
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
        this.selectedregionID=1;
        this.onRegionChange();
        this.historyFilterForm.get('regionID')?.disable();
        break;
    case 'KSAAdmin':
        this.selectedregionID=2;
        this.onRegionChange();
        this.historyFilterForm.get('regionID')?.disable();
        break;
    case 'UAEAdmin':
        this.selectedregionID=3;
        this.onRegionChange();
        this.historyFilterForm.get('regionID')?.disable();
        break;
    case 'Qatar':
        this.selectedregionID=4;
        this.onRegionChange();
        this.historyFilterForm.get('regionID')?.disable();
        break;
    default:
        break;
    }
}


  subscribeToTemplateState(){
    this.showLoader=true;
    this.getallTemplate$.subscribe((response:any) => {
      if (response) {
        this.templateDetailList=response as tempList[];
        this.showLoader=false;   
        }
    });
  }
  // subscribeToFilterState(){
  //   this.showLoader=true;
  //   this.getFilterResponse$.subscribe((response:any) => {
  //     if (response) {
  //       this.filterResult=response as filterModel[];
  //       this.showLoader=false;   
  //       }
  //   });
  // }
  

  getAllTemplates(){
    this.showLoader=true;
    this.store.dispatch(new GetAllTemplateAction )
    .subscribe(
      (response) => {
        if (response) {
          this.showLoader = false;
          //console.log(response)
        }
      },
      (error) => {
        this.showLoader = false;
      });
    
  }

  createFilterForm(filterModel?:filterModel){
    this.historyFilterForm=this.formBuilder.group({
      statusCode:[filterModel?.statusCode ?? ''],
      accepted:[filterModel?.accepted ?? ''],
      rejected:[filterModel?.rejected ?? ''],
      dtTo:[filterModel?.dtTo ?? ''],
      dtFrom:[filterModel?.dtFrom ?? ''],
      templateId:[{value:filterModel?.templateId ?? '',disabled:true},[Validators.required]],
      bearerToken:[filterModel?.bearerToken ?? '',[Validators.required]],
      regionID:[{value:filterModel?.regionID ?? ''},[Validators.required]],
      areaID:[{value:filterModel?.areaID ?? '',disabled:true},[Validators.required]],
      branchID:[{value:filterModel?.branchID ?? '',disabled:true},[Validators.required]],
      
    })

  }

    onRegionChange(){
      this.historyFilterForm.patchValue({ regionID:this.selectedregionID})
      this. getAllAreasListById(this.selectedregionID)
      this.historyFilterForm.get('areaID')?.enable();  
      this.getFilteredTempList();  
      this.historyFilterForm.get('templateId')?.enable();    

    }

    getFilteredTempList(){
      this.getallTemplate$.subscribe((response:any) => {
        if (response) {
          const allTemp=response as tempList[];
          this.templateDetailList=allTemp.filter((temp:tempList)=>{
          return temp.regionID==+this.selectedregionID
          });       
          }
      });
    }

    onAreaChange(){
        this.historyFilterForm.patchValue({ areaID:this.selectedAreaID})
        this. getAllBranchListById(this.selectedAreaID);
        this.historyFilterForm.get('branchID')?.enable();    
    } 

    onBranchChange(): void {
      if (this.checkBranchToken(this.selectedBranchID)) {
          debugger;
          this.historyFilterForm.patchValue({ branchId: this.selectedBranchID });
          this.getBearerTokenOfBranch(this.selectedBranchID);
      }
  }
  
  checkBranchToken(branchId: string): boolean {
      const branch = this.allBranchList.find(branch => branch.id === Number(branchId));
      if (branch && branch.bearerT === '') {
          this.toaster.add({ severity: 'error', summary: 'Error', detail: "This Branch has no History" });
          this.noHistory=true;
          return false;
      } else {
        this.noHistory=false;
          return true;
      }
  }
  
    
    getBearerTokenOfBranch(branchId: number) {
      const branch = this.allBranchList.find(branch => branch.id === Number(branchId));
      this.historyFilterForm.get('bearerToken')?.setValue(branch.bearerT)
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
          //console.log(response)
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
              //console.log(response)
          if (response && response?.branchState.areaList) {
            this.allAreaList=response?.branchState?.areaList
            this.showLoader = false;
          }
          //console.log(this.allAreaList)
          },
          (error) => {
          this.showLoader = false;
          });
      
      }  

    submit(){
      if(this.selectedStatus=[]){
        this.formFilterModel={
          dtFrom:this.historyFilterForm.get('dtFrom')?.value,
          dtTo:this.historyFilterForm.get('dtTo')?.value,
          rejected:this.historyFilterForm.get('rejected')?.value,
          accepted:this.historyFilterForm.get('accepted')?.value,
          bearerToken:this.historyFilterForm.get('bearerToken')?.value,
        }
        this.getFilteredData(this.formFilterModel)
      }
      else{
        this.setStatus();
        this.formFilterModel={
          dtFrom:this.historyFilterForm.get('dtFrom')?.value,
          dtTo:this.historyFilterForm.get('dtTo')?.value,
          rejected:this.historyFilterForm.get('rejected')?.value,
          accepted:this.historyFilterForm.get('accepted')?.value,
          bearerToken:this.historyFilterForm.get('bearerToken')?.value,
        }
        this.getFilteredData(this.formFilterModel)
      }

    }
    reset(){
      this.historyFilterForm.reset()
    }

    setStatus(){
      const status =this.historyFilterForm.get('statusCode')?.value;
      status.forEach((s: any) => {
        if (s.name === 'Dlivered' && s.value) {
          this.historyFilterForm.get('accepted')?.setValue('true');
          //console.log(this.historyFilterForm.get('accepted'))
        }
        if (s.name === 'UnDlivered' && s.value) {
          this.historyFilterForm.get('rejected')?.setValue('true');
        }
      });
      
    }
    getFilteredData(filterModel: any){
      this.showLoader = true;
      const templateIds = this.historyFilterForm.get('templateId')?.value;
      const templateIdsList = templateIds.map((template: any) => template.id);
      const templateIdsListName = templateIds.map((template: any) => template.templateName);
    
      this.store.dispatch(new FilterHistoryAction(filterModel)).subscribe(
        (response: any) => {
          console.log(response.historyState)
          if (response.historyState) {
            const responseList = response.historyState;
            const filteredResponse = responseList.filter(item => templateIdsList.includes(item.templateId))
              .map(item => ({ ...item, templateName: templateIdsListName[templateIdsList.indexOf(item.templateId)] }));
              this.filterResult=filteredResponse
            this.showLoader = false;
            this.getTotalCost();
            this.getTotalCount();
          }
        },
        (error) => {
          this.showLoader = false;
        });
    }
    
    exportToPdf() {
      this.toaster.add({ severity: 'info', summary: 'Info', detail: 'Export Report in Progress may take a while !' });
      const doc = new jspdf.jsPDF();
      const table = this.table.nativeElement;
      let currentPage = 1;
      let resultsPerPage = this.rows; 
      let totalResults = this.filterResult.length; // Total number of results
      let totalPages = Math.ceil(totalResults / resultsPerPage); // Calculate total number of pages
    
      const exportPage = () => {
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = Math.min(startIndex + resultsPerPage, totalResults);
        const currentPageResults = this.filterResult.slice(startIndex, endIndex);
    
        setTimeout(() => {
          html2canvas(table, { ignoreElements: (element) => element.tagName === 'IFRAME' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 size
            const pageHeight = 295; // A4 size
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            if (currentPage > 1) {
              doc.addPage();
            }
            doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
            if (currentPage === totalPages) {
              doc.save('table.pdf');
            } else {
              currentPage++;
              const nextButton = document.querySelector('.p-paginator-next');
              if (nextButton) {
                nextButton.dispatchEvent(new Event('click'));
                exportPage();
              } else {
                console.error('Next button not found');
              }
            }
          });
        }, 1000);
      };
    
      const updateResultsPerPage = () => {
        resultsPerPage = this.rows; // Update the number of results per page
        totalResults = this.filterResult.length; // Update the total number of results
        totalPages = Math.ceil(totalResults / resultsPerPage); // Recalculate total number of pages
        currentPage = 1; // Reset current page to 1
      };
    
      // Listen for changes in page size
      const paginator = document.querySelector('.p-paginator');
      if (paginator) {
        paginator.addEventListener('change', updateResultsPerPage);
        this.resetPaginator();
      }
    
      // Start exporting from the first page
      exportPage();
    }
    
    
    onPageChange(event: any) {
      if (this.first !== event.first || this.rows !== event.rows) {
        this.rows = event.rows; 
        console.log(this.first , this.rows , event.first)
        this.resetPaginator()
      }
    }

   
    resetPaginator() {
        this.first = 0;
    }

    dataReady: boolean = false;

    onDataLoadComplete() {
      this.dataReady = true;
    }
    
    getTotalCost(): number {
      for (let i = 0; i < this.filterResult.length; i++) {
        const cost = +this.filterResult[i].cost;
        if (cost !== null && !isNaN(cost)) {
          this.totalCost =this.totalCost +cost;
        }
      }
      return  this.totalCost ;
    }


    getTotalCount(): number {
      for (let i = 0; i < this.filterResult.length; i++) {
        const totalCount = +this.filterResult[i].totalCount;
        if (totalCount !== null && !isNaN(totalCount)) {
          this.totalCount =this.totalCost + totalCount;
        }
      }
      return  this.totalCount ;
    }
    
  

    
  
}
