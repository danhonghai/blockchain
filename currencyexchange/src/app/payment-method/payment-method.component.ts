import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { HttpUtilsService } from '../service/http-utils.service';
import { Router } from '@angular/router';
import { Md5 } from "ts-md5/dist/md5";
import { AlertService } from '../alert/alert.service';
@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {

  previewImgObj;
  myForm: FormGroup;
  constructor(
    private httpUtilsService: HttpUtilsService,
    private router : Router,
    fb : FormBuilder,
    private alertService:AlertService) {

    this.myForm = fb.group({
      payMode:'1',
      name: ['',Validators.required],
      bankName: [''],
      bankAddress: [''],
      accountNo: ['',Validators.required],
      fundPwd: ['',Validators.required]
    })
  }

  ngOnInit() {
  }

  //添加支付方式
  addPayment(){
    if(this.myForm.value.payMode == 1 && !this.myForm.value.bankName){//银行卡
      this.alertService.setMessage("开户银行不能为空");
      return false;
    }
    if(this.myForm.value.payMode == 1 && !this.myForm.value.bankAddress){//银行卡
      this.alertService.setMessage("开户支行不能为空");
      return false;
    }
    if((this.myForm.value.payMode == 2 || this.myForm.value.payMode == 3) && !this.previewImgObj){
      this.alertService.setMessage("请上传二维码");
      return false;
    }else if((this.myForm.value.payMode == 2 || this.myForm.value.payMode == 3) && this.previewImgObj){
      this.myForm.value['fileName'] = this.previewImgObj.fileName;
      this.myForm.value['qrCodeImg'] = this.previewImgObj.previewImgFile;
    }
    let formParams = Object.assign({},this.myForm.value);
    formParams['fundPwd'] = Md5.hashStr(formParams['fundPwd']);
    this.httpUtilsService.getJsonPost("auth/aq",formParams,data => {
      this.alertService.setMessage("支付方式添加成功","success");
      this.router.navigate(['/userinfo']);
    })
  }

}
