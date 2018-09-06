import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {Router} from "@angular/router";
import { HttpUtilsService } from '../service/http-utils.service';
import { SessionStorage } from '../module/session.storage';
import { Md5 } from "ts-md5/dist/md5";
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  coinList : string[];
  currentCoinIndex = 0;
  currentCoinname;//当前币种
  pageParams;
  option = {//分页信息
      size:10,
      total:0
  };
  dataList : object[] = new Array();
  currentPayType = 0;//当前支付方式
  currentFiatType = 0;//当前法币类型
  params = {};
  userinfo;

  constructor(
    private sessionStorage: SessionStorage,
    private router: Router,
    private httpUtilsService: HttpUtilsService,
    private alertService:AlertService,
    private pipe : DecimalPipe
    ) {
  }
  ngOnInit() {
    this.pageParams = {
      index:0,
      size:10,
      coinId:'',
      direct:2, //1:出售 2:购买
      payType:0, //支付方式 银行 1 微信 2 支付宝 3 paypal 4 默认全部
      fiatType:0, //法币类型 人民币 1 新加坡币 2 默认全部
    }
    this.fiatCoinList();
    //this.pageTest(1);
    //判断是否登录成功
    if(this.sessionStorage.getObject("loginInfo").token){
      this.userInfo();
    }

  }

  /*个人信息查询*/
  userInfo(){
    this.httpUtilsService.getPost("auth/fiatAccount",{},data => {
     this.userinfo = data.data;
     if(!data.data.nickName){
        $('#nickModal').modal('show');
     }
    })
  }

  //设置昵称
  setNickName(formData){
    this.httpUtilsService.getDataPost("auth/nickNameSet",formData,data => {
      this.alertService.setMessage("昵称设置成功",'success');
      $('#nickModal').modal('hide');
    })
  }

  /*币种列表*/
  fiatCoinList(){
    this.httpUtilsService.getDataPost("api/fiatCoinList",{},data => {
      this.coinList = data.data;
      this.pageParams['coinId'] = this.coinList[0]['coinId'];
      this.currentCoinname = this.coinList[0]['name'];
      this.queryTradeList(1);
    })
  }

  //切换购买出售
  swithTab(direct){
    this.pageParams['direct'] = direct;
    this.currentFiatType = 0;
    this.currentPayType = 0;
    this.pageParams.payType = 0;
    this.pageParams.fiatType = 0;
    this.queryTradeList(1);
  }

  //切换币种
  switchCoin(id,index,coinName){
    this.currentCoinIndex = index;
    this.currentCoinname = coinName;
    this.pageParams['coinId'] = id;
    this.currentFiatType = 0;
    this.currentPayType = 0;
    this.pageParams.payType = 0;
    this.pageParams.fiatType = 0;
    this.queryTradeList(1);
  }

  //交易列表
  queryTradeList(page){
    this.pageParams['index'] = page - 1;
    this.httpUtilsService.getDataPost("api/tradeIndex",this.pageParams,data => {
        this.dataList = data.data.dataList;
        for(let i = 0; i<this.dataList.length; i++){
          this.dataList[i]['transMode'] = this.dataList[i]['transMode'].split('|');
          this.dataList[i]['isBuy'] = false;
        }
        this.option['index'] = page;
        this.option['all'] = Math.ceil(data.data.total/this.pageParams.size);
        this.option['count'] = data.data.totalIndex>10?10:data.data.totalIndex;
        this.option['total'] = data.data.total;
    })
  }
  //分页
  queryFun(index:any){
    this.queryTradeList(index);
  }

  //购买
  buyBits(index,type,isAdvance){
    //判断是否登录成功
    if(!this.sessionStorage.getObject("loginInfo").token){
      this.alertService.setMessage("未登录,请先登录！");
      this.router.navigate(['/login']);
      return false;
    }
    if(isAdvance == 1 && this.userinfo.certification != 2){
      this.alertService.setMessage("为了您的资金安全，在进行交易前请先完成高级认证！");
      return false;
    }
    if(type == 0){
      this.params = {};
      for(let i = 0; i<this.dataList.length; i++){
        if(i == index){

          this.dataList[i]['isBuy'] = true;
        }else{
          this.dataList[i]['isBuy'] = false;
        }
      }
    }else{
      for(let i = 0; i<this.dataList.length; i++){
        this.dataList[i]['isBuy'] = false;
      }
    }

  }

  //选择支付方式
  selectPayMent(payType){
    this.currentPayType = payType;
    this.pageParams.payType = payType;
    this.queryTradeList(1);
  }

  //选择法币类型
  selectFiat(fiatType){
    this.currentFiatType = fiatType;
    this.pageParams.fiatType = fiatType;
    this.queryTradeList(1);
  }

  checkTotalMoney(value,applyPerPrice){
    this.params['transAmount'] = this.pipe.transform(value/applyPerPrice,'.0-6');
  }

  checkTransAmount(value,applyPerPrice){
    this.params['transTotalMoney'] = this.pipe.transform(value*applyPerPrice,'.0-2');
  }

  //下单
  tradeFun(item){

    let formParams = {};
    this.params['advanceId'] = item.applyId;
    this.params['direct'] = this.pageParams.direct == 1 ? '2':'1';
    Object.assign(formParams, this.params);
    formParams['transTotalMoney'] = formParams['transTotalMoney'].split(',').join('');
    formParams['transAmount'] = formParams['transAmount'].split(',').join('');

    let myreg = /^(([1-9]\d*(\.\d{0,1}[1-9])?)|(0\.\d{0,1}[1-9]))$/;
    if(!myreg.test(formParams['transTotalMoney'])){
      this.alertService.setMessage("下单金额不合法,最多2位小数");
      return false;
    }

    if(formParams['transTotalMoney']>item.applyMaxPrice || formParams['transTotalMoney'] < item.applyMinPrice){
      this.alertService.setMessage("下单金额不符合限额");
      return false;
    }

    //   /^(([1-9]\d*(\.\d{0,5}[1-9])?)|(0\.\d{0,5}[1-9]))$/
    let reg = /^(([1-9]\d*(\.\d{1,6})?)|(0\.\d{1,6}))$/;
    if(formParams['transAmount'] == 0){
      this.alertService.setMessage("下单数量不允许为0");
      return false;
    }
    if(!reg.test(formParams['transAmount'])){
      this.alertService.setMessage("下单数量不合法,最多6位小数");
      return false;
    }


    if(this.pageParams.direct == 1){
      formParams['tradePwd'] = Md5.hashStr(this.params['tradePwd']);
    }
    this.httpUtilsService.getDataPost("auth/trade",formParams,data => {
      let orderNo = data.data;
      if(this.pageParams.direct == 2){
        this.router.navigate(['/orderDetail'],{ queryParams: { orderNo: orderNo } });
      }else{
        this.router.navigate(['/orderSell'],{ queryParams: { orderNo: orderNo } });
      }

    })
  }

}
