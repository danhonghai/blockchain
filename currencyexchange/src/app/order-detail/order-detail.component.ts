import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import { ActivatedRoute } from "@angular/router";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { decimalValidator } from '../valid/valid';
import { AlertService } from '../alert/alert.service';
import { Order } from '../module/module';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  orderNo;
  applyId;
  orderInfo = new Order();
  leftTime;  //倒计时时间
  min:string = '0';
  sec:string = '0';
  orderStatus;  //当前订单状态
  intervalStatus;  //轮询方法
  countDownStatus;  //倒计时方法
  imgSrc;
  myForm : FormGroup;
  params = {
    firstMoney:0,
    lastMoney:0
  };
  currentCoin;

  constructor(
    private httpUtilsService: HttpUtilsService,
    private routerInfo: ActivatedRoute,
    fb : FormBuilder,
    private alertService:AlertService) {
    this.myForm = fb.group({
      accountFirst: 1,
      accountLast: 2,
      amount : ['',[Validators.required,decimalValidator]]
    }) }

  ngOnInit() {
    this.orderNo = this.routerInfo.snapshot.queryParams["orderNo"];
    this.applyId = this.routerInfo.snapshot.queryParams["applyId"];
    if(this.orderNo){
      this.traderOrder(this.orderNo);
    }else{
      this.alertService.setMessage("非法操作",'warning');
    }

  }

  //法币交易订单
  traderOrder(orderNo){
    this.httpUtilsService.getDataPost("auth/tradeOrder",{orderNo:orderNo},data => {
        this.orderInfo = data.data;
        this.orderStatus = this.orderInfo['orderStatus'];
        if(this.orderInfo['orderStatus'] == 0){//未付款
          this.leftTime = 15*60-Math.floor((data.data.currentTime - data.data.orderTime)/1000);
          if(this.leftTime <= 0){
            console.log(1);
            //取消订单
            this.operateOrder(1);
          }else{
            //停止计时
            clearInterval(this.countDownStatus);
            this.countDown(this.leftTime);
          }
        }else if(this.orderInfo['orderStatus'] == 2){//已支付
          clearInterval(this.intervalStatus);
          this.intervalFun();
        }else{
          //用户未付款倒计时进行其他操作停止倒计时
          clearInterval(this.countDownStatus);
        }

    })
  }

  //倒计时组件
  countDown(leftTime){
    this.countDownStatus=setInterval(() => {
      var minute = 0,second = 0;
      if(leftTime > 0){
        minute = Math.floor(leftTime / 60);
        second = Math.floor(leftTime) - (minute * 60);
      }else{
        clearInterval(this.countDownStatus);
        //取消订单
        console.log(2);
        this.operateOrder(1);
      }

      if (minute <= 9) {
        this.min = "0" + minute.toString();
      }else{
        this.min = minute.toString();
      };
      if (second <= 9) {
        this.sec = "0" + second.toString();
      }else{
        this.sec = second.toString();
      };
      leftTime--;
    },1000);
  }

   //轮询查询数据,等待放币中
  intervalFun(){
    this.intervalStatus=setInterval(() => {
      if(this.orderStatus == 2){
        this.traderOrder(this.orderNo);
      }

    },15000);
  }

  //订单交易操作
  operateOrder(operateType,otherParams?:object){
    let params = {
      orderNo : this.orderNo,
      operateType : operateType
    }
    if(otherParams){
      Object.assign(params,otherParams);
    }
    this.httpUtilsService.getDataPost("auth/operateOrder",params,data => {
      this.traderOrder(this.orderNo);
      if(operateType == 2){
        $('#appealModal').modal('hide');
      }
    })
  }


  //系统取消订单
  cancelOrderBySystem(){
    this.httpUtilsService.getDataPost("api/tradeCancel",{orderNo:this.orderNo},data => {
      this.traderOrder(this.orderNo);
    })
  }

  //复制
  copyFun(){
    var key  = $('#key')
    key.select(); //选择对象
    var tag = document.execCommand("Copy"); //执行浏览器复制命令
    if(tag){
        this.alertService.setMessage("复制成功",'success');
    };
  }

  //查看二维码
  openCodeModal(imgSrc){
    this.imgSrc = imgSrc
  }

  //打开资产划转弹窗
  openExampleModal(){
    this.httpUtilsService.getDataPost("auth/fa",{},data => {
      let accountRes = data.data.accountRes;
      for(var i = 0; i< accountRes.length; i++){
        if(this.orderInfo['orderCoinName'] == accountRes[i].coinName){
          this.currentCoin = accountRes[i];
          this.params['firstMoney'] = this.currentCoin['fiatAccount'].available;
          this.params['lastMoney'] = this.currentCoin['coinAccount'].available;
        }
      }
    })
    this.myForm.reset({ accountFirst: 1,accountLast:2,amount:'' });
    this.params['direct'] = 2;
  }

  //选择交易方向
  selectAccount(event,type){
    if(type == 1){
      if(event.target.value == 1){//法币
        this.myForm.patchValue({accountLast:2});
        this.params['firstMoney'] = this.currentCoin['fiatAccount'].available;
        this.params['lastMoney'] = this.currentCoin['coinAccount'].available;
        this.params['direct'] = 2;
      }else{//币币
        this.myForm.patchValue({accountLast:1});
        this.params['firstMoney'] = this.currentCoin['coinAccount'].available;
        this.params['lastMoney'] = this.currentCoin['fiatAccount'].available;
        this.params['direct'] = 1;
      }
    }else{
      if(event.target.value == 1){//法币
        this.myForm.patchValue({accountFirst:2});
        this.params['firstMoney'] = this.currentCoin['coinAccount'].available;
        this.params['lastMoney'] = this.currentCoin['fiatAccount'].available;
        this.params['direct'] = 1;

      }else{//币币
        this.myForm.patchValue({accountFirst:1});
        this.params['firstMoney'] = this.currentCoin['fiatAccount'].available;
        this.params['lastMoney'] = this.currentCoin['coinAccount'].available;
        this.params['direct'] = 2;
      }
    }
  }

  //选择全部
  choiceAll(){
    this.myForm.patchValue({amount:this.params['firstMoney']});
  }

  //资产划转
  transfer(){
    let transferParams = {
      coinId : this.currentCoin['coinId'],
      coinName : this.currentCoin['coinName'],
      fiatAccountId : this.currentCoin['fiatAccount'].accountId,
      coinAccountId : this.currentCoin['coinAccount'].accountId,
      direct : this.params['direct'],
      amount : this.myForm.get('amount').value,
    }
    this.httpUtilsService.getDataPost("auth/faTransfer",transferParams,data => {
      this.alertService.setMessage("操作成功！",'success');
      $('#exampleModal').modal('hide');
    })
  }

}
