import { Injectable } from '@angular/core';
import {CanActivate,Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {Observable} from "rxjs";
import { SessionStorage } from '../module/session.storage';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class LoginGuard implements CanActivate{

  constructor(private sessionStorage: SessionStorage,
     private router: Router,
    private alertService:AlertService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    return new Observable((observer) => {
      //判断是否登录
      if (this.sessionStorage.getObject("loginInfo").token) {
          observer.next(true);
          observer.complete();
          return;
      }
      this.alertService.setMessage("未登录，请先登录！");
      this.router.navigate(['/login']);
      observer.next(false);
      observer.complete();
    });
  }
}
