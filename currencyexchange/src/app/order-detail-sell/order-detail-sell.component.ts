import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import { ActivatedRoute } from "@angular/router";
import { Md5 } from "ts-md5/dist/md5";
import { AlertService } from '../alert/alert.service';
import { Order } from '../module/module';


@Component({
  selector: 'app-order-detail-sell',
  templateUrl: './order-detail-sell.component.html',
  styleUrls: ['./order-detail-sell.component.css']
})
export class OrderDetailSellComponent implements OnInit {

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

  constructor(private httpUtilsService: HttpUtilsService,private routerInfo: ActivatedRoute,
    private alertService:AlertService) { }

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
            //系统取消订单
            this.cancelOrderBySystem();
            console.log(1);
          }else{
            //停止计时
            clearInterval(this.countDownStatus);
            clearInterval(this.intervalStatus);
            //倒计时
            this.countDown(this.leftTime);
            //等待对方付款的过程中，轮询
            this.intervalFun();
          }
        }else if(this.orderInfo['orderStatus'] == 2){//已支付
          //停止计时
          clearInterval(this.intervalStatus);
          //确认到账过程中，轮询，判断对方是否提交申诉
          this.intervalFun();
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
        clearInterval(this.intervalStatus);
        //取消订单
        this.cancelOrderBySystem();
        console.log(2);
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

  //轮询查询数据，等待对方付款
  intervalFun(){
    this.intervalStatus=setInterval(() => {
      if(this.orderStatus == 0 || this.orderStatus == 2){
        this.traderOrder(this.orderNo);
      }else{
        clearInterval(this.intervalStatus);
        clearInterval(this.countDownStatus);
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
    console.log(otherParams);
    this.httpUtilsService.getDataPost("auth/operateOrder",params,data => {
      this.traderOrder(this.orderNo);
      if(operateType == 4){
        $('#fundpwdModal').modal('hide');
      }
      if(operateType == 2){
        $('#appealModal').modal('hide');
      }
    })
  }

  //确认放币
  confirmAccount(obj){
    let params = {
      tradePwd : Md5.hashStr(obj.fundPwd)
    }
    this.operateOrder(4,params)

  }

  //系统取消订单
  cancelOrderBySystem(){
    this.httpUtilsService.getDataPost("api/tradeCancel",{orderNo:this.orderNo},data => {
      this.traderOrder(this.orderNo);
    })
  }

  //查看二维码
  openCodeModal(imgSrc){
    this.imgSrc = imgSrc
  }

}

