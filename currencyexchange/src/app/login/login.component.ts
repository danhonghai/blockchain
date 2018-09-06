import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import { SessionStorage } from '../module/session.storage';
import { Router } from '@angular/router';
import { Md5 } from "ts-md5/dist/md5";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  imgCode: string;
  params;

  constructor(
    private sessionStorage: SessionStorage,
    private httpUtilsService: HttpUtilsService,
    private router : Router
  ) { }

  ngOnInit() {
    this.params = {
      account:'',
      password:'',
      captcha:'',
      token:'',
      type: 1
    }
    this.getCaptcha();
    //console.log(Md5.hashStr("a111111"));
  }

  /**
   * 获取图形验证码
   */
  getCaptcha() {
    this.httpUtilsService.httpPost("captcha",{},data => {
      this.imgCode = "data:image/png;base64,"+data.body.img;
      this.params['token'] = data.body.token;
    })
  }

  //登录
  login() {
    let loginParams = {...this.params};
    loginParams['password'] = Md5.hashStr(loginParams['password']);
    this.httpUtilsService.httpPost("login",loginParams,data => {
      let loginInfo = {
        token:data.body.token,
        account:this.params['account']
      }
      this.sessionStorage.setObject("loginInfo",loginInfo);
      this.router.navigate(['/home']);
    })
  }

}
