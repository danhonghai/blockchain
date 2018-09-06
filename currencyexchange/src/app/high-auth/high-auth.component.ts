import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import { ActivatedRoute } from "@angular/router";
import { AlertService } from '../alert/alert.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-high-auth',
  templateUrl: './high-auth.component.html',
  styleUrls: ['./high-auth.component.css']
})
export class HighAuthComponent implements OnInit {

  previewImgObj;
  currentStep: number = 0;
  params : object = {};

  constructor(
    private httpUtilsService: HttpUtilsService,
    private routerInfo: ActivatedRoute,
    private alertService:AlertService,
    private router: Router) { }

  ngOnInit() {
    this.httpUtilsService.getDataPost("auth/fiatAccount",{},data => {
      if(!data.data.identification){//未实名认证
        this.alertService.setMessage("请先实名认证")
        this.router.navigate(['/userinfo']);
      }else if(data.data.certification == 2){
        this.alertService.setMessage("高级认证审核通过")
        this.router.navigate(['/userinfo']);
      }else if(data.data.certification == 3){
        this.currentStep = 5;
      }else if(data.data.certification == 1){
        this.currentStep = 4;
      }
    })
  }

  /*开始高级认证*/
  authClick(){
    this.currentStep = 1;
  }

  //返回
  back(){
     this.currentStep = this.currentStep - 1;
     this.previewImgObj = "";
  }

  nextStep(){
    if(this.currentStep == 1){
      this.params['frontImg'] = this.previewImgObj.previewImgFile;
      this.params['frontName'] = this.previewImgObj.fileName;
      this.previewImgObj = "";
      this.currentStep = this.currentStep + 1;
    }else if(this.currentStep == 2){
      this.params['backImg'] = this.previewImgObj.previewImgFile;
      this.params['backName'] = this.previewImgObj.fileName;
      this.previewImgObj = "";
      this.currentStep = this.currentStep + 1;
    }else if(this.currentStep == 3){
      this.currentStep = 6;
      this.params['handImg'] = this.previewImgObj.previewImgFile;
      this.params['handName'] = this.previewImgObj.fileName;
      this.params['voice'] = "123";
      this.httpUtilsService.getJsonPost("auth/ac",this.params,data => {
        this.currentStep = 4;
      })
    }else if(this.currentStep == 5){
      this.currentStep = 1;
    }

  }

}
