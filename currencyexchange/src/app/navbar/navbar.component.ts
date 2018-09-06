import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd} from "@angular/router";
import { SessionStorage } from '../module/session.storage';
import { HttpUtilsService } from '../service/http-utils.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  account : string;
  constructor(private sessionStorage: SessionStorage,private router: Router,private httpUtilsService: HttpUtilsService) {

  }

  ngOnInit() {
    this.router.events
      .subscribe((event: NavigationEnd) => {
        if(event instanceof NavigationEnd){
          // 当路由发生变化，存储在浏览器里面的的用户信息发生变化的时候刷新组件
          this.account = this.sessionStorage.getObject("loginInfo").account;
        }
      });
  }

  //退出登录
  loginout(){
     this.httpUtilsService.httpPost("logout",{},data => {
         this.sessionStorage.remove("loginInfo");
         this.router.navigate(["/login"]);
     })
  }

}
