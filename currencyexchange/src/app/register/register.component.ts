import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { HttpUtilsService } from '../service/http-utils.service';
import { pwdValidator,mobileValidator,emailValidator } from '../valid/valid';
import { SessionStorage } from '../module/session.storage';
import { Router } from '@angular/router';
import { Md5 } from "ts-md5/dist/md5";
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  imgCode : string;
  countryList : object[];
  mobileArea : string;
  currentType: number = 1;
  params: object = {};
  registerForm: FormGroup;
  emailForm: FormGroup;

  constructor(
    private sessionStorage: SessionStorage,
    private httpUtilsService: HttpUtilsService,
    private router : Router,
    fb : FormBuilder,
    private alertService:AlertService) {

    this.registerForm = fb.group({
        countryItem:['',Validators.required],
        account:['',[Validators.required,mobileValidator]],
        capCode:['',Validators.required],
        code:['',Validators.required],
        pwd:['',[Validators.required,pwdValidator]],
        secondPwd:['',Validators.required],
        phoneCheck:[false,Validators.requiredTrue]
    })
    this.emailForm = fb.group({
        country:['',Validators.required],
        account:['',[Validators.required,emailValidator]],
        capCode:['',Validators.required],
        code:['',Validators.required],
        pwd:['',[Validators.required,pwdValidator]],
        secondPwd:['',Validators.required],
        invalidCheck:[false,Validators.requiredTrue]
    })
  }

  ngOnInit() {
    this.getCountryInfo();
    this.getCaptcha();
  }

  //切换注册类型
  regTypeChange(type){
    this.currentType = type;
    if(type == 1){//手机注册
      this.registerForm.reset({
          countryItem:''
        }
      );
    }else{
      this.emailForm.reset({
          country:''
        });
    }
    this.getCaptcha();
  }

  /**
   * 获取图形验证码
   */
  getCaptcha() {
    this.httpUtilsService.httpPost("captcha",{},data => {
      this.imgCode = "data:image/png;base64,"+data.body.img;
      this.params['captoken'] = data.body.token;
    })
  }

  /**
   * 获取国籍信息
   */
  getCountryInfo() {
    this.httpUtilsService.httpPost("countryInfo",{},data => {
      this.countryList = data.body.countryInfoList;
    })
  }

  //选择上国籍，改变区号
  selectCountry(event){
    if(event.target.value){
      let countryItem = JSON.parse(event.target.value);
      this.mobileArea = countryItem.areaCode;
    }else{
      this.mobileArea = "";
    }
  }

  //获取手机验证码
  getphoneCodefun(id) {
    let country,capCode,account,type;
    if(this.currentType == 1){//手机注册
      country = this.registerForm.value.countryItem;
      capCode = this.registerForm.value.capCode;
      account = this.registerForm.value.account;
      type = 1;
    }else{
      country = this.emailForm.value.country;
      capCode = this.emailForm.value.capCode;
      account = this.emailForm.value.account;
      type = 2;
    }
    if(!country){
      this.alertService.setMessage("请先选择国籍");
      return false;
    }
    if(!capCode){
      this.alertService.setMessage("请输入图片验证码");
      return false;
    }
    if (account) {
      var senddata = {
          account: account,
          capCode: capCode ,
          captoken: this.params['captoken'],
          type: type,
      }
      this.httpUtilsService.httpPost("code", senddata, data => {
        this.params['token'] = data.body.token;
        this.httpUtilsService.timer(60, "#"+id);
          this.alertService.setMessage("验证码发送成功，请注意查收！",'success');
        })
      } else {
        var msg = this.currentType == 1 ? "请输入手机号" : "请输入邮箱";
        alert(msg);
      }
  }

  //注册
  registerFun(){
    if(this.currentType == 1){//手机注册
      Object.assign(this.params,this.registerForm.value);
      this.params['country'] = JSON.parse(this.registerForm.value.countryItem).id;
      delete this.params['countryItem'];
      delete this.params['phoneCheck'];
    }else{
      Object.assign(this.params,this.emailForm.value);
      delete this.params['invalidCheck'];
    }
    this.params['pwd'] = Md5.hashStr(this.params['pwd']);
    this.params['secondPwd'] = Md5.hashStr(this.params['secondPwd']);
    this.params['type'] = this.currentType;
    this.httpUtilsService.httpPost("register", this.params,data => {
      var loginParams = {
        account:this.params['account'],
        captcha:this.params['capCode'],
        password:this.params['pwd'],
        token:this.params['captoken'],
        type:1
      }
      this.httpUtilsService.httpPost("login",loginParams,data => {
        let loginInfo = {
          token:data.body.token,
          account:this.params['account']
        }
        this.sessionStorage.setObject("loginInfo",loginInfo);
        this.router.navigate(['/home']);
      })
    })
  }
}
