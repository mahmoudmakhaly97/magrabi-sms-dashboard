import { Injectable } from '@angular/core';
import { addUser } from '../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = environment.baseApiUrl;
  constructor(private http: HttpClient,private toastr: MessageService)  { }

  addUser(user:addUser): Observable<any> {
    const url = `${this.baseUrl}/register`;
    return this.http.post(url,user)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllUser(): Observable<any> {
    const url = `${this.baseUrl}/api/ViewAllUsers`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
      this.toastr.add({ severity: 'error', summary: 'Error', detail:errorMessage });
    } else {
      errorMessage = `Server error: ${error.status}, ${error.error.message}`;
      this.toastr.add({ severity: 'error', summary: 'Error', detail:errorMessage });
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
