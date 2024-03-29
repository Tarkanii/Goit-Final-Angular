import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { IStore } from 'src/app/shared/interfaces/store';
import { logoutAction } from 'src/app/store/user/user.actions';
import { emailSelector, tokenSelector } from 'src/app/store/user/user.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public token$: Observable<string> = this.store.select(tokenSelector);
  public username$: Observable<string>;

  constructor(
    private store: Store<IStore>
  ) {
    // Sets first part of email as username
    this.username$ = this.store.select(emailSelector).pipe(
      map((email: string) => email.split('@')[0])
    )
  }

  public logout(): void {
    this.store.dispatch(logoutAction());
  }

}
