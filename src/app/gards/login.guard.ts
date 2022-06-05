import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor (private authService: AuthService,
    private router : Router) {}
    canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log(this.authService.isAdmin());

    
    if (this.authService.isAdmin())
    this.router.navigate(['dashboard']);
    else
    {
    this.router.navigate(['login']);
    return false;
    }
  }   
  
}
