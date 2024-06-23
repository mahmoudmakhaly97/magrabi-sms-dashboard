import { Component, Renderer2 } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthState } from '../state/auth.state';
import { Select, Store } from '@ngxs/store';
import { AuthLogin } from '../models/auth.model';
import { Observable, Subscription } from 'rxjs';
import { LoginAction } from '../state/auth.action';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: UntypedFormGroup;
  submitted:any = false;
  error:any = '';
  returnUrl: string;
    // set the currenr year
  year: number = new Date().getFullYear();
  showLoader:boolean=false;

  @Select(AuthState.login)
  login$!: Observable<AuthLogin>;

  loginSub = new Subscription();




    // tslint:disable-next-line: max-line-length
    constructor(private formBuilder: UntypedFormBuilder, 
                private router: Router,
                private renderer: Renderer2,
                private toastr:MessageService,
                private store:Store) { }
  
    ngOnInit() {
      this.createLoginForm();
      this.subscribeToLoginState();
      this.renderer.setStyle(document.body, 'background-image', 'linear-gradient(to left, #4283EC 0%, #04BEFE 100%)');                         
  }



    onSubmit() {
      this.showLoader=true;
      if (this.loginForm.valid) {
      const userName = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      this.store.dispatch(new LoginAction(this.loginForm.value))
      .subscribe((response:any) => {
        if (response.length !=0 && response.token !=null) {
          this.router.navigate(['/dashboard']);
          }
      },
      (error) => {
        this.showLoader = false;
      })
      } 
      else {this.loginForm.markAllAsTouched(); this.showLoader = false; }

    }

    ngOnDestroy() {
      // Reset the background color when the component is destroyed
      this.renderer.removeStyle(document.body, 'background-image');
    }

    subscribeToLoginState(){
      this.showLoader=false;
      this.loginSub.add(
        this.login$.subscribe((response:any) => {
            if (response.length !=0 && response.token !=null) {
              this.router.navigate(['/dashboard']);
              }
          },
          (error) => {
            this.showLoader = false;
          }
          
      ))
 
    }




    createLoginForm(authmodel?:AuthLogin){
      this.loginForm = this.formBuilder.group({
        username: [authmodel?.username, [Validators.required]],
        password: [authmodel?.password, [Validators.required]],
      });
    }
}
