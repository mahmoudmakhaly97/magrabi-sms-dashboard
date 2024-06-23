import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addUser } from '../../models/user.model';
import { Select, Store } from '@ngxs/store';
import { AddUserAction, GetAllUserAction } from '../../state/user.action';
import { UserState } from 'src/app/message/state/users/user.state';
import { userList } from 'src/app/message/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit{

  breadCrumbItems: Array<{}>;
  selectedCountry:string='Egypt';
  users:any=[];
  showLoader:boolean=false;
  addUserForm:FormGroup;
  selectedregionID:any='';

  @Select(UserState.getAllUserList)
  getAllUser$!: Observable<any>;

  allUserList:any=[];

  constructor(private formBuilder:FormBuilder,private store:Store){}
  
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Users' }, { label: 'Add New User', active: true }];
    this.createAddUserForm();
    this.subscribeToAllUserList();
    this. getAllUserList();
    console.log(this.allUserList)

  }
  createAddUserForm(userModel?:addUser){
    this.addUserForm=this.formBuilder.group({
      username:[userModel?.username ?? '',[Validators.required]],
      email:[userModel?.email ?? '',[Validators.required,Validators.email]],
      password:[userModel?.password ?? '',[Validators.required]],
      roleID:[userModel?.roleID ?? '',[Validators.required]],
    })

  }
  onRegionChange(){
    this.addUserForm.patchValue({
      roleID:this.selectedregionID
    })
  }

  submit() {
    this.showLoader = true;
    console.log(this.addUserForm.value);
  
    this.store.dispatch(new AddUserAction(this.addUserForm.value)).subscribe(
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
            this.showLoader = false;
            console.log(response.addUserState['userList'])
          }
        },
        (error) => {
          this.showLoader = false;
        });
      
    }

    reset(){
      this.addUserForm.reset();
    }
  


}
