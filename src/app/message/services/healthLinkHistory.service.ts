import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { healthLink } from '../models/healthLinkHistory.model'; 

@Injectable({
  providedIn: 'root'
})
export class HealthLinkHistoryService {
  private baseUrl = environment.baseApiUrl + '/api'; 

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  // Use the showError method to display errors
  showError(message: string) {
    this.toastr.error('Error', message, { timeOut: 3000 });
  }

  getAllHealthLink(): Observable<any> {
    const url = `${this.baseUrl}/VSTendResponse/send-data`;
    return this.http.get(url).pipe(
      catchError(this.handleError.bind(this)) // Bind the correct context for `this`
    );
  }

  sendHealthLinkData(healthLinkData: healthLink): Observable<any> {
    const url = `${this.baseUrl}/VSTendResponse/send-data`;
    return this.http.post(url, healthLinkData).pipe(
      catchError(this.handleError.bind(this)) // Bind the correct context for `this`
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
      this.showError(errorMessage); // Use showError method here
    } else {
      errorMessage = `Server error: ${error.status}, ${error.error.message}`;
      this.showError(errorMessage); // Use showError method here
    }
    console.error(errorMessage);
    return throwError(errorMessage); 
  }
}
