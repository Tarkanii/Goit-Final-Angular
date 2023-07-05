import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { IStore } from '../interfaces/store';
import { Store } from '@ngrx/store';
import { tokenSelector } from 'src/app/store/user/user.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<IStore>,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, { url }: RouterStateSnapshot): Observable<boolean> {
    return this.store.select(tokenSelector).pipe(
      map((token: string) => {
        if (url.includes('auth')) {
          token && this.router.navigateByUrl('/projects');
          return !token;
        } else {
          !token && this.router.navigateByUrl('/auth/login');
          return !!token;
        }
      })
    )
  }
}
