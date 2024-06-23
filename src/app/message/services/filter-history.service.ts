import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { smsProviderModel } from '../models/quickMessage.model';
import { filterModel } from '../models/filter.model';

@Injectable({
  providedIn: 'root'
})
export class FilterHistoryService {

  private baseUrl = environment.baseApiUrl + '/api';

  constructor(private http: HttpClient,private toastr: MessageService) {}

    //Call getFilterHistory
    getFilterHistory(filterModel:filterModel): Observable<any> {
      const url = `${this.baseUrl}/History?dtFrom=${filterModel.dtFrom}&dtTo=${filterModel.dtTo}&rejected=${filterModel.rejected}&accepted=${filterModel.accepted}&bearerToken=${filterModel.bearerToken}`;
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
