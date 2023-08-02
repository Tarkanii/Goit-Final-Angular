import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Store } from '@ngrx/store';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { IStore } from '../shared/interfaces/store';
import { setLoadingAction } from '../store/general/general.actions';
import { InfoDialogComponent } from '../shared/dialogs/info-dialog/info-dialog.component';
import { logoutAction } from '../store/user/user.actions';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private store: Store<IStore>,
    private dialog: MatDialog,
    private scrollStrategyOptions: ScrollStrategyOptions
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/assets')) return next.handle(req);

    //setTimeout was added to fix NG0100 issue. Example of the same fix can be found in the video in Angular documentation about this error.
    setTimeout(() => this.store.dispatch(setLoadingAction({ value: true })), 0);

    return next.handle(req).pipe(
      tap((response) => {
        if (response.type !== HttpEventType.Response) return;

        //setTimeout was added to fix NG0100 issue. Example of the same fix can be found in the video in Angular documentation about this error.
        setTimeout(() => this.store.dispatch(setLoadingAction({ value: false })), 0);
      }),
      catchError((error: HttpErrorResponse) => {
        //setTimeout was added to fix NG0100 issue. Example of the same fix can be found in the video in Angular documentation about this error.
        setTimeout(() => this.store.dispatch(setLoadingAction({ value: false })), 0);

        if (error.status === 401 && !error.url?.includes('/logout')) {
          this.dialog.closeAll();
          this.dialog.open(InfoDialogComponent, {
            data: {
              message: `LABELS.ERRORS.INVALID_TOKEN`
            },
            width: '450px',
            autoFocus: false,
            scrollStrategy: this.scrollStrategyOptions.noop()
          })

          this.store.dispatch(logoutAction());
        }

        if (error.status === 500 || !error.status) {
          this.dialog.closeAll();
          this.dialog.open(InfoDialogComponent, {
            data: {
              message: `LABELS.ERRORS.SERVER_ERROR`
            },
            width: '450px',
            autoFocus: false,
            scrollStrategy: this.scrollStrategyOptions.noop()
          })
        }

        return throwError(error);
      }));
  }
}
