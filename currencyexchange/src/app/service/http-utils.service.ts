import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import { SessionStorage } from '../module/session.storage';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class HttpUtilsService {

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type':'application/json;application/x-www-form-urlencodeed; charset=utf-8'})
  };
  private baseUrl = "/apis/Api-Fiat/";
  private rootUrl = "/apis/Api-App/";

  constructor(private http: HttpClient,private sessionStorage: SessionStorage,private router : Router,private alertService:AlertService) { }

  public httpPost(url: string, params: any,callback){
    let token = this.sessionStorage.getObject("loginInfo").token || "";
    let time = new Date().getTime().toString();
    const headers = new HttpHeaders().set("token", token).set("time",time);
    this.http.post(this.rootUrl+url,params,{headers})
      .subscribe(
        (response) => {
          if(response['success'] == "true"){
            return callback(response);
          }else if(response['errCode'] == "401") {
            this.sessionStorage.remove("loginInfo");
            this.alertService.setMessage("登录失效，请前往登录！",'danger');
            this.router.navigate(['/login']);
          }else{
            this.alertService.setMessage(response['errMsg'],'danger');
          }
        },
        error => {
          this.alertService.setMessage("系统异常！",'danger');
          return false;
      })
  }

  public getDataPost(url: string, params: any,callback){
    let token = this.sessionStorage.getObject("loginInfo").token || "";
    let time = new Date().getTime().toString();
    const headers = new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded;multipart/related; charset=utf-8',
      token : token,
      time : time
    });

    let body = this.setParams(params);
    this.http.post(this.baseUrl+url,body,{headers})
      .subscribe(
        response => {
          if(response['success'] == "true"){
            return callback(response);
          }else if(response['errCode'] == "401") {
            this.sessionStorage.remove("loginInfo");
            this.alertService.setMessage("登录失效，请前往登录！",'danger');
            this.router.navigate(['/login']);
          }else{
            this.alertService.setMessage(response['errMsg'],'danger');
          }
        },
        error => {
          this.alertService.setMessage("系统异常",'danger');
          return false;
      })
  }

  public getPost(url: string, params: any,callback){
    let token = this.sessionStorage.getObject("loginInfo").token || "";
    let time = new Date().getTime().toString();
    const headers = new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded;multipart/related; charset=utf-8',
      token : token,
      time : time
    });

    let body = this.setParams(params);
    this.http.post(this.baseUrl+url,body,{headers})
      .subscribe(
        response => {
          if(response['success'] == "true"){
            return callback(response);
          }else if(response['errCode'] == "401") {
            this.sessionStorage.remove("loginInfo");
          }else{
            this.alertService.setMessage(response['errMsg'],'danger');
          }
        },
        error => {
          this.alertService.setMessage("系统异常",'danger');
          return false;
      })
  }

  public getJsonPost(url: string, params: any,callback){
    let token = this.sessionStorage.getObject("loginInfo").token || "";
    let time = new Date().getTime().toString();
    const headers = new HttpHeaders({
      token : token,
      time : time
    });
    this.http.post(this.baseUrl+url,params,{headers})
      .subscribe(
        response => {
          if(response['success'] == "true"){
            return callback(response);
          }else if(response['errCode'] == "401") {
            this.sessionStorage.remove("loginInfo");
            this.alertService.setMessage("登录失效，请前往登录！",'danger');
            this.router.navigate(['/login']);
          }else{
            this.alertService.setMessage(response['errMsg'],'danger');
          }
        },
        error => {
          this.alertService.setMessage("系统异常",'danger');
          return false;
      })
  }

  public timer(time, buttonid){
    var btn = $(buttonid);
    btn.attr("disabled", 'true'); //按钮禁止点击
    btn.html(time <= 0 ? "发送动态密码" : ("" + (time) + "秒后可发送"));
    var hander = setInterval(function() {
        if (time <= 0) {
            clearInterval(hander); //清除倒计时
            btn.html("发送验证码");
            btn.removeAttr("disabled");
            return false;
        } else {
            btn.html("" + (time--) + "秒后可发送");
        }
    }, 1000);
  }


  //请求参数格式封装
  setParams(params){
    let str = [];
    for (var p in params) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
    }
    return str.join("&");
  }

}
