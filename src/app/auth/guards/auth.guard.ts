import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

type CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable()
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate: CanActivateFn = (route, state) => {
    if (!this.authService.authToken) {
      console.log(this.authService.authToken)
      return this.router.createUrlTree(['/login']);
    }
    return true;
  };
}
