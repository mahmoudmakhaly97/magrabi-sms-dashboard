import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createBranch } from '../models/branch.model';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {
  private baseUrl = environment.baseApiUrl;
  constructor(private http: HttpClient,private toastr: MessageService)  { }

  addBranch(branch:createBranch): Observable<any> {
    const url = `${this.baseUrl}/api/CreateBranch`;
    return this.http.post(url,branch)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllBranches(): Observable<any> {
    const url = `${this.baseUrl}/api/GetAllBranches`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  getBrancheById(id:number): Observable<any> {
    const url = `${this.baseUrl}/api/GetBranchByAreaID?areaId=${id}`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllAreas(id:number): Observable<any> {
    const url = `${this.baseUrl}/api/GetArea?regionId=${id}`;
    return this.http.get(url)
      .pipe(
        catchError(this.handleError)
      );
  }
 editBranch(branch: createBranch): Observable<any> {
    const url = `http://service.themagsmen.com/api/EditBranch/1`;
    return this.http.post(url, branch)
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
