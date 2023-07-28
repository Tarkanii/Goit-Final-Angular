import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { IStore } from '../shared/interfaces/store';
import { Store } from '@ngrx/store';
import { setLoadingAction } from '../store/general/general.actions';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private store: Store<IStore>
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store.dispatch(setLoadingAction({ value: true }));

    return next.handle(req).pipe(
      tap((response) => {
        if (response.type !== HttpEventType.Response) return;
        //setTimeout was added to fix NG0100 issue. Example of the same fix can be found in the video in Angular documentation about this error.
        setTimeout(() => this.store.dispatch(setLoadingAction({ value: false })), 0);
      }),
      catchError((error: HttpErrorResponse) => {
        setTimeout(() => this.store.dispatch(setLoadingAction({ value: false })), 0);
        return throwError(error);
      }));
  }
}
