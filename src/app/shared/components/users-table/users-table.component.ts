import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { userListModel } from '../../models/userlist.model';


@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit{
  // Table data
  userList:userListModel[];
  total: Observable<number>;
  createContactForm!: UntypedFormGroup;
  submitted = false;
  contacts: any;
  files: File[] = [];
  itemsPerPage: number = 10;


  
  // @ViewChildren(NgbdUserListSortableHeader) headers!: QueryList<NgbdUserListSortableHeader>;
  @ViewChild('staticModal') public staticModal:ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  deleteId: any;

  constructor(private modalService: BsModalService) {
    this.total = of(10);
    this.userList = [
      {
        id: 1,
        name: "Dr.Radwa Taher",
        gender: "Female",
        email: "david@skote.com",
        status: 'Approval',
        nationalty: "SUDANEESE",
      },
      {
        id: 4,
        name: "Dr. Mohammed El Shafei",
        gender: "Male",
        email: "mark@skote.com",
        status: 'Approval',
        nationalty: "SAUDI",
      },
      {
        id: 7,
        name: "Dr. Maarouf  Alkhouli",
        gender: "Male",
        email: "john@skote.com",
        status: 'Dis-approval',
        nationalty: "JORDANIAN",
      },
      {
        id: 9,
        name: "Dr. Mohammed Basulaiman",
        gender: "Male",
        email: "mark@skote.com",
        status: 'Approval',
        nationalty: "SAUDI",
      },
      {
        id: 12,
        name: "Dr. Layan Elshehri",
        gender: "Demale",
        email: "john@skote.com",
        status: 'Expired',
        nationalty: "PALESTENIAN",
      },
      {
        id: 1,
        name: "Dr.Radwa Taher",
        gender: "Female",
        email: "david@skote.com",
        status: 'Approval',
        nationalty: "SUDANEESE",
      },
      {
        id: 4,
        name: "Dr. Mohammed El Shafei",
        gender: "Male",
        email: "mark@skote.com",
        status: 'Approval',
        nationalty: "SAUDI",
      },
      {
        id: 7,
        name: "Dr. Maarouf  Alkhouli",
        gender: "Male",
        email: "john@skote.com",
        status: 'Dis-approval',
        nationalty: "JORDANIAN",
      },
      {
        id: 9,
        name: "Dr. Mohammed Basulaiman",
        gender: "Male",
        email: "mark@skote.com",
        status: 'Approval',
        nationalty: "SAUDI",
      },
      {
        id: 12,
        name: "Dr. Layan Elshehri",
        gender: "Demale",
        email: "john@skote.com",
        status: 'Expired',
        nationalty: "PALESTENIAN",
      },
     

    ]
  }

  ngOnInit(): void {}

 
  
    // Delete User
    removeUser(id: any) {
      this.deleteId=id
      this.removeItemModal?.show();
    }
  
    // confirmDelete() {
    //   userList.splice(this.deleteId, 1);
    //   this.removeItemModal?.hide();
    // }
}






