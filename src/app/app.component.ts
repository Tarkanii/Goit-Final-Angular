import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { IStore } from './shared/interfaces/store';
import { setUserStateAction } from './store/user/user.actions';
import { RequestsService } from './services/requests.service';
import { getProjectsAction } from './store/projects/projects.actions';
import { sidebarFormOpenSelector } from './store/projects/projects.selectors';
import { loadingSelector } from './store/general/general.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  
  public loading$: Observable<boolean> = this.store.select(loadingSelector);
  public sidebarFormOpen$: Observable<string | null> = this.store.select(sidebarFormOpenSelector);
  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private translateService: TranslateService,
    private store: Store<IStore>,
    private requestService: RequestsService
  ) {
    this.translateService.use('en');
    
    if (localStorage.getItem('userState')) {
      const userState = JSON.parse(String(localStorage.getItem('userState')));
      this.requestService.setToken(userState.token);
      this.store.dispatch(setUserStateAction(userState));
      if (userState.token) {
        this.store.dispatch(getProjectsAction());
      }
    }

    this.store
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ user }: IStore) => localStorage.setItem('userState', JSON.stringify(user)))
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
