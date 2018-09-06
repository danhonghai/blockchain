import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators,FormArray,FormControl} from "@angular/forms";
import { HttpUtilsService } from '../service/http-utils.service';
import { decimalValidator,towBitsValidator } from '../valid/valid';
import { Router } from '@angular/router';
import { Md5 } from "ts-md5/dist/md5";
import { AlertService } from '../alert/alert.service';


@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.component.html',
  styleUrls: ['./advertising.component.css']
})
export class AdvertisingComponent implements OnInit {

  coinList : string[];
  coinName;
  coinId;
  baseCoinName = "CNY";
  formParams = {
    payModelObj:{}
  };
  paymentInfoList :string[];
  myForm: FormGroup;
  lastAccount;
  constructor(private httpUtilsService: HttpUtilsService,fb : FormBuilder,private router : Router
    ,private alertService:AlertService) {
    this.myForm = fb.group({
      direct:[1,Validators.required],
      transBaseType:[1,Validators.required],
      amount:['',[Validators.required,decimalValidator]],
      perPrice:['',[Validators.required,towBitsValidator]],
      minPrice:['',[Validators.required,towBitsValidator]],
      maxPrice:['',[Validators.required,towBitsValidator]],
      isLimited:[false],
      fundsPwd:['',Validators.required],
      phoneCheck:[false,Validators.requiredTrue]
    })
  }

  ngOnInit() {
    this.userInfo();
  }

  /*个人信息查询*/
  userInfo(){
    this.httpUtilsService.getDataPost("auth/fiatAccount",{},data => {
      if(data.data.isMerchant == 0){
        this.alertService.setMessage("请先申请成为商家!",'warning');
        this.router.navigate(['/businessApply']);
      }else{
        this.fiatCoinList();
      };
      this.paymentInfoList = data.data.paymentInfoList;
    })
  }

  /*法币币种列表*/
  fiatCoinList(){
    this.httpUtilsService.getDataPost("api/fiatCoinList",{},data => {
      this.coinList = data.data;
      this.coinName = this.coinList[0]['name'];
      this.formParams['coinName'] = this.coinList[0]['name'];
      this.formParams['coinId'] = this.coinList[0]['coinId'];
      this.accountByConinId(this.coinList[0]['coinId']);
    })
  }

  selectFiatCoin(event){
    if(event.target.value){
      let coinItem = JSON.parse(event.target.value);
      this.coinName = coinItem['name'];
      this.formParams['coinName'] = coinItem['name'];
      this.formParams['coinId'] = coinItem['coinId'];
      this.accountByConinId(coinItem['coinId']);
    }
  }

  //根据coinId查询可用余额
  accountByConinId(coinId){
    this.httpUtilsService.getDataPost("auth/fiatCoin",{coinId:coinId},data => {
      this.lastAccount = data.data.accountAvailable;
    })
  }


  selectBaseCoin(event){
    if(event.target.value ==1){
      this.baseCoinName = "CNY";
    }else if(event.target.value ==2){
      this.baseCoinName = "SGD";
    }
  }

  //选择交易方式
  clickPayModel(event){
    this.formParams.payModelObj[event.target.value] = event.target.checked;
  }

  //发布广告
  applyPublish(){
    //处理表单数据
    Object.assign(this.formParams, this.myForm.value);
    this.formParams['isLimited'] = this.formParams['isLimited'] ? 1 : 0;

    let payModel = this.formParams['payModelObj'];
    let payModelArray = [];
    for(let key in payModel){
      if(payModel[key]){
        payModelArray.push(key)
      }
    };
    this.formParams['payModel'] = payModelArray.join('|');
    this.formParams['fundsPwd'] = Md5.hashStr(this.formParams['fundsPwd']);
    delete this.formParams['phoneCheck'];
    //delete this.formParams['payModelObj'];

    if(this.formParams['direct'] == "2" && this.formParams['amount'] > this.lastAccount){
      this.alertService.setMessage("申请数量大于可出售余额!");
      return false;
    }

    if(this.formParams['maxPrice'] > (this.formParams['amount'] * this.formParams['perPrice'])){
      this.alertService.setMessage("最大限额不得大于总价!");
      return false;
    }
    if(this.formParams['maxPrice'] < this.formParams['minPrice']){
      this.alertService.setMessage("最大限额不得小于最小限额!");
      return false;
    }
    if(payModelArray.length == 0){
      this.alertService.setMessage("请至少选择一种交易方式!");
      return false;
    }

    this.httpUtilsService.getDataPost("auth/applyPublish",this.formParams,data => {
      this.alertService.setMessage("广告发布成功!",'success');
      this.router.navigate(['/home']);
    })

  }

}
