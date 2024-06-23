import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SmsproviderInterceptor implements HttpInterceptor {

  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request is to the specific base URL
    if (request.url.startsWith('https://api.taqnyat.sa')) {
      // Add Bearer token to the headers
      const token = '449144056019f81b729d160a7ed5ce21'; // Replace with your actual token
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
