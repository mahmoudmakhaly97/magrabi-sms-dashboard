import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { smsProviderModel } from '../models/quickMessage.model';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SmsProviderService {
  private baseUrl = environment.baseApiUrl + '/api';
  private smsBaseUrl = environment.smsProviderUrl;

  constructor(private http: HttpClient,private toastr: MessageService) {}

    //Call Sms provider
    callSmsProvider(smsModel:smsProviderModel): Observable<any> {
      const url = `${this.baseUrl}/Delegator/sms/`;
      return this.http.post(url,smsModel)
        .pipe(
          catchError(this.handleError)
        );
    }

    //Get Statistics from Sms provider
    getStatisticsSmsProvider(bearerToken): Observable<any> {
      const url = `${this.baseUrl}/Delegator/bearerToken?bearerToken=${bearerToken}`;
      return this.http.get(url)
        .pipe(
          catchError(this.handleError)
        );
    }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
      this.toastr.add({ severity: 'Client error', summary: 'Error', detail:errorMessage });

    } else {
      errorMessage = `Server error: ${error.status}, ${error.error.message}`;
      this.toastr.add({ severity: 'Server error', summary: 'Error', detail:errorMessage });
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
