import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthLogin } from 'src/app/autientication/models/auth.model';
import { AuthState } from 'src/app/autientication/state/auth.state';
import { Select } from '@ngxs/store';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  @Select(AuthState.role)
  role$!: Observable<AuthLogin>;
  userRole:string;

  
  constructor(private router: Router,private toaster: MessageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = ['SuperAdmin']; 

    this.role$.subscribe((response:any) => {
      if (response) {this.userRole=response;}
      else{
        const token=JSON.parse(localStorage.getItem('Token') || '{}')
        this.userRole=token.role
      }
    });

    if (allowedRoles.includes(this.userRole)) {
      return true;
    } else {
      // Redirect to 401 Unauthorized page or any other page
      this.router.navigate(['/dashboard/401-unauthorized']);
      this.toaster.add({ severity: 'error', summary: 'Error', detail: "You un-authorized to acess this page ,Contact your Adminstration !"});

      return false;
    }
  }
}
