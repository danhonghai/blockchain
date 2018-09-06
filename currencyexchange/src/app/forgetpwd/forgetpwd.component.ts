import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,Validators } from "@angular/forms";
import { HttpUtilsService } from '../service/http-utils.service';
import { pwdValidator,mobileValidator } from '../valid/valid';
import { Md5 } from "ts-md5/dist/md5";
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-forgetpwd',
  templateUrl: './forgetpwd.component.html',
  styleUrls: ['./forgetpwd.component.css']
})
export class ForgetpwdComponent implements OnInit {

  private imgCode : string;
  navmenus ;
  accountPrams : object = {};
  checkPrams : object = {};
  resetParams : object = {};
  accountType : number;
  resetForm : FormGroup;

  constructor(private httpUtilsService: HttpUtilsService,fb: FormBuilder,
    private alertService:AlertService) {
    this.resetForm = fb.group({
      pwd: ['',[Validators.required,pwdValidator]],
      secondPwd:[''],
    })
  }

  ngOnInit() {
    this.navmenus = [
      {name:"填写账户", istrue:false, success:true},
      {name:"账户验证", istrue:false, success:false},
      {name:"重置密码", istrue:false, success:false},
      {name:"完成", istrue:false, success:false},
    ];
    this.getCaptcha();
  }

  /**
   * 获取图形验证码
   */
  getCaptcha() {
    this.httpUtilsService.httpPost("captcha",{},data => {
      this.imgCode = "data:image/png;base64,"+data.body.img;
      this.accountPrams['token'] = data.body.token;
    })
  }
  //切换tab
  onnavmenu(index){
    if(this.navmenus[index].istrue || (index > 0 && !this.navmenus[index-1].istrue)){
      return false;
    }
    for (var i = 0; i < this.navmenus.length; i++) {
      if (i==index) {
        this.navmenus[i].success = true;
      }else{
        this.navmenus[i].success = false;
      }
    }
  }
  //填写账户
  validAccount() {
    //判断账号是邮箱还是手机号
    if(this.accountPrams['account'].indexOf("@") != -1){
        this.accountType = 2; //邮箱
      }else{
      this.accountType = 1; //手机
      }
    this.httpUtilsService.httpPost("account/valid",this.accountPrams,data => {
      this.checkPrams = {
        account:data.body.account,
        infoToken: data.body.infoToken
      };
      this.navmenus[0].istrue = true;
      this.onnavmenu(1);
      this.getCaptcha();
    })
  }
  //获取手机验证码
  getphoneCodefun() {
    if(!this.checkPrams['imageCode']){
      this.alertService.setMessage("请输入图片验证码");
      return false;
    }
    var senddata = {
        account: this.checkPrams['account'],
        capCode: this.checkPrams['imageCode'] ,
        captoken: this.accountPrams['token'],
        type: this.accountType,
    }
    this.httpUtilsService.httpPost("code", senddata, data => {
    this.checkPrams['token'] = data.body.token;
        this.httpUtilsService.timer(60, "#sendButton_forget");
        this.alertService.setMessage("验证码发送成功，请注意查收","success");
    })
  }

  //账号验证
  checkAccount(){
    this.checkPrams['imageToken'] = this.accountPrams['token'];
    this.httpUtilsService.httpPost("acount/check", this.checkPrams, data => {
      this.resetParams = {
        infoToken: this.checkPrams['infoToken']
      };
      this.navmenus[1].istrue = true;
      this.onnavmenu(2);
    })
  }
  //重置密码
  resetPwd(){
    let loginParams = {...this.resetParams};
    loginParams['pwd'] = Md5.hashStr(loginParams['pwd']);
    loginParams['secondPwd'] = Md5.hashStr(loginParams['secondPwd']);
    this.httpUtilsService.httpPost("reset/pwd",loginParams, data => {
      this.navmenus[2].istrue = true;
      this.onnavmenu(3);
    })
  }
}
