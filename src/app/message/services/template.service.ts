import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tempConfig } from '../models/tempConfig.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private baseUrl = environment.baseApiUrl + '/api'; // Adjust the base URL as needed

  constructor(private http: HttpClient,private toastr: ToastrService) {}

  //Get All Template
  getAllTemplates(): Observable<any> {
    const url = `${this.baseUrl}/GetAllTemplates/`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  //Edit Template
  editTemplates(id,template:tempConfig): Observable<any> {
    const url = `${this.baseUrl}/EditConfiguration/${id}`;
    return this.http.post(url,template)
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
