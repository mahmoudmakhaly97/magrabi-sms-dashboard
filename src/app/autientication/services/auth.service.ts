import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthLogin } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseApiUrl;
  jwtHelper = new JwtHelperService();
  private userPayLoad:any;

  constructor(private http: HttpClient,private toastr: MessageService) {
    this.userPayLoad=this.decodeToken();

  }

  login(credentails:AuthLogin): Observable<any> {
    const url = `${this.baseUrl}/login/`;
    return this.http.post(url,credentails)
      .pipe(
        catchError(this.handleError)
      );
  }

  decodeToken(){
    const token = this.returnToken();
    token.pipe(
      tap((response)=>{
        return this.jwtHelper.decodeToken(response!)
      })
    )
  }

  storeToken(Token:string){
    localStorage.setItem('Token',JSON.stringify(Token));
  }

  deleteToken(){
    localStorage.removeItem('Token');
    return of (null)
  }

  returnToken(){
    const token = localStorage.getItem('Token');
    return of (token);
  }

  checkExpireDate(){
    const token=this.returnToken();
    token.pipe(
      tap((response)=>{
        return this.jwtHelper.isTokenExpired(response!);
      })
    )
  }


  getRoleFromToken(): Observable<string | null> {
    return this.returnToken().pipe(
      map((token: string | null) => {
        if (token) {
          const parseToken =JSON.parse(token)
          const decodedToken = this.jwtHelper.decodeToken(parseToken.token);
          parseToken.role = decodedToken?.Role;
          this.storeToken(parseToken)
          return parseToken.role;
        } else {
          console.error('Token not found');
          return null;
        }
      })
    );
  }
  getUsername(): Observable<string | null> {
    return this.returnToken().pipe(
      map((token: string | null) => {
        if (token) {
          const parseToken =JSON.parse(token)
          const decodedToken = this.jwtHelper.decodeToken(parseToken.token);
          parseToken.username = decodedToken?.Username;
          this.storeToken(parseToken)
          return parseToken.Username;
        } else {
          console.error('Token not found');
          return null;
        }
      })
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
