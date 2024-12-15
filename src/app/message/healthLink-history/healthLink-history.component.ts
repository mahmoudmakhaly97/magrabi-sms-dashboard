import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { historyStatus, templatView } from '../models/history.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
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
import { HealthLinkHistoryService } from '../services/healthLinkHistory.service';

@Component({
  selector: 'app-healthLink-history',
  templateUrl: './healthLink-history.component.html',
  styleUrls: ['./healthLink-history.component.scss']
})
export class HealthLinkHistoryComponent {
  breadCrumbItems: Array<{}>;
  statuses: historyStatus[] = [];
  selectedStatus!: historyStatus[];
  templates: templatView[] = [];
  selectedTemplate!: templatView[];
  allBranchList: any[] = [];
  allAreaList: any[] = [];
  filterResult: any;
  historyFilterForm: FormGroup;
  showLoader: boolean = false;
  selectedregionID: any = '';
  selectedAreaID: any = '';
  selectedBranchID: any = '';
  bearerToken: string = '';
  templateDetailList: tempList[] = [];
  formFilterModel: filterModel;
  @ViewChild('table') table: ElementRef;
  userRole: string = '';
  noHistory: boolean = false;
  originalFilterResult: any;
  rows: number = 10;
  first: number = 0;
  totalCost: number = 0;
  totalCount: number = 0;

  @Select(branchState.getbranches)
  getAllBranches$!: Observable<any>;

  @Select(MessageState.getAllTemplate)
  getallTemplate$!: Observable<tempList>;

  @Select(historyState.getFilterResponse)
  getFilterResponse$!: Observable<filterModel>;

  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;

  constructor(private formBuilder: FormBuilder, private store: Store, private toaster: HealthLinkHistoryService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'HealthLink' }, { label: 'History', active: true }];
    this.initStatuses();
    this.createFilterForm();
    this.subscribeToTemplateState();
    this.getAllHealthLink();
  }

  initStatuses() {
    this.statuses = [
      { name: 'Delivered', value: true },
      { name: 'UnDelivered', value: true }
    ];
  }

  subscribeToTemplateState() {
    this.showLoader = false;
    this.getallTemplate$.subscribe((response: any) => {
      if (response) {
        this.templateDetailList = response as tempList[];
        this.showLoader = false;
      }
    });
  }

  getAllHealthLink() {
    this.showLoader = true; 
    this.toaster.getAllHealthLink().subscribe(
      (response) => {
        if (response && response.data) {
          this.filterResult = response.data;
          this.showLoader = false; 
        } else {
          this.showLoader = false; 
        }
      },
      (error) => {
        this.showLoader = false; 
        this.toaster.showError('Failed to load HealthLink data'); 
      }
    );
  }

  createFilterForm(filterModel?: filterModel) {
    this.historyFilterForm = this.formBuilder.group({
      statusCode: [filterModel?.statusCode ?? ''],
      accepted: [filterModel?.accepted ?? ''],
      rejected: [filterModel?.rejected ?? ''],
      dtTo: [filterModel?.dtTo ?? ''],
      dtFrom: [filterModel?.dtFrom ?? ''],
      templateId: [{ value: filterModel?.templateId ?? '', disabled: true }, [Validators.required]],
      bearerToken: [filterModel?.bearerToken ?? '', [Validators.required]],
      regionID: [{ value: filterModel?.regionID ?? '' }, [Validators.required]],
      areaID: [{ value: filterModel?.areaID ?? '', disabled: true }, [Validators.required]],
      branchID: [{ value: filterModel?.branchID ?? '', disabled: true }, [Validators.required]],
    });
  }

  reset() {
    this.historyFilterForm.reset();
  }

  getFilteredData(filterModel: any) {
    this.showLoader = false;
    const templateIds = this.historyFilterForm.get('templateId')?.value;
    const templateIdsList = templateIds.map((template: any) => template.id);
    const templateIdsListName = templateIds.map((template: any) => template.templateName);

    this.store.dispatch(new FilterHistoryAction(filterModel)).subscribe(
      (response: any) => {
        console.log(response.historyState);
        if (response.historyState) {
          const responseList = response.historyState;
          const filteredResponse = responseList.filter(item => templateIdsList.includes(item.templateId))
            .map(item => ({ ...item, templateName: templateIdsListName[templateIdsList.indexOf(item.templateId)] }));
          this.filterResult = filteredResponse;
          this.showLoader = false;
        }
      },
      (error) => {
        this.showLoader = false;
      }
    );
  }

  onPageChange(event: any) {
    if (this.first !== event.first || this.rows !== event.rows) {
      this.rows = event.rows;
      console.log(this.first, this.rows, event.first);
      this.resetPaginator();
    }
  }

  resetPaginator() {
    this.first = 0;
  }

}