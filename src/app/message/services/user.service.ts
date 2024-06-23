import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseApiUrl + '/api';

  constructor(private http: HttpClient,private toastr: ToastrService) {}

  
  //Get All AppApproval List
  getAppApprovalList(): Observable<any> {
    const url = `${this.baseUrl}/AppApproval/`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  //Get All AppCancel List
  getAppCancelList(): Observable<any> {
    const url = `${this.baseUrl}/AppCancel/`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
      this.toastr.error('Client error', errorMessage,{timeOut: 3000});

    } else {
      errorMessage = `Server error: ${error.status}, ${error.error.message}`;
      this.toastr.error('Client error', errorMessage,{timeOut: 3000});
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
