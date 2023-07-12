import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { IStore } from './shared/interfaces/store';
import { setUserStateAction } from './store/user/user.actions';
import { RequestsService } from './services/requests.service';
import { getProjectsAction } from './store/projects/projects.actions';
import { addProjectFormOpenSelector } from './store/projects/projects.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  
  public addProjectFormOpen$: Observable<boolean> = this.store.select(addProjectFormOpenSelector);
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
