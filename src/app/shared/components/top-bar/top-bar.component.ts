import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { GetTokenAction, RemoveTokenAction } from 'src/app/autientication/state/auth.action';
import { AuthState } from 'src/app/autientication/state/auth.state';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit{
  @Output() sideMenuToggled = new EventEmitter<boolean>(false);
  sideMenuIndicator:boolean=false;
  userRole:string;
  username:string;

  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;

  @Select(AuthState.username)
  username$!: Observable<AuthLogin>;

  constructor(private router:Router,private store:Store){}

  ngOnInit(): void {
    this.subscribeToRoleState();
    this.subscribeToUsername();
  }


    toggleSideMenu() {
      this.sideMenuIndicator = !this.sideMenuIndicator;
      this.sideMenuToggled.emit(this.sideMenuIndicator);
    }
  

    logout(){
      this.store.dispatch(new RemoveTokenAction())
      this.router.navigate(['/account/login']);      

    }
    subscribeToRoleState(){
      this.role$.subscribe((response:any) => {
        if (response) {this.userRole=response; }
          else{
            const token=JSON.parse(localStorage.getItem('Token') || '{}')
            this.userRole=token.role
          }
      });
    }
    subscribeToUsername(){
      this.username$.subscribe((response:any) => {
        if (response) {this.username=response; }
          else{
            const token=JSON.parse(localStorage.getItem('Token') || '{}')
            this.username=token.username
          }
      });
    }


  
}
