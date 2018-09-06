import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-my-ad',
  templateUrl: './my-ad.component.html',
  styleUrls: ['./my-ad.component.css']
})
export class MyAdComponent implements OnInit {


  option = {//分页信息
      size:10,
      total:0
  };
  pageParams ;
  dataList : object[] = new Array();
  orderDataList : object[] = new Array();
  applyId;
  orderPage;//查看订单页面
  orderOption = {//分页信息
      size:10,
      total:0
  };
  currentStatus = 5;

  constructor(private httpUtilsService : HttpUtilsService,private alertService:AlertService) {
    this.pageParams = {
      index:0,
      size:10
    }
    this.orderPage = {
      index:0,
      size:10,
      applyId:''
    }
  }

  ngOnInit() {
    this.myAdList(1)
  }

  //我的广告
  myAdList(page){
    this.pageParams['index'] = page - 1;
    this.httpUtilsService.getDataPost("auth/applyList",this.pageParams,data => {
        this.dataList = data.data.dataList;
        this.option['index'] = page;
        this.option['all'] = Math.ceil(data.data.total/this.pageParams.size);
        this.option['count'] = data.data.totalIndex>10?10:data.data.totalIndex;
        this.option['total'] = data.data.total;
    })
  }

  //分页方法
  queryFun(index){
    this.myAdList(index);
  }

  //查看下单
  orderList(page,applyId?){
    this.orderPage['index'] = page - 1;
    if(applyId){
      this.orderPage.applyId = applyId;
    }
    this.httpUtilsService.getDataPost("auth/applyDetail",this.orderPage,data => {
        this.orderDataList = data.data.dataList;
        this.orderOption['index'] = page;
        this.orderOption['all'] = Math.ceil(data.data.total/this.orderPage.size);
        this.orderOption['count'] = data.data.totalIndex>10?10:data.data.totalIndex;
        this.orderOption['total'] = data.data.total;
    })
  }

  //下单分页方法
  queryOrder(index){
    this.orderList(index);
  }

  //广告作废
  openInvalidModal(applyId){
    this.applyId = applyId;
  }

  //广告作废
  invalidAd(){
    this.httpUtilsService.getDataPost("auth/applyTrash/"+this.applyId,{},data => {
      this.alertService.setMessage("操作成功",'success');
      this.myAdList(1);
    })
  }

  //选择交易状态
  selectStatus(type){
    this.currentStatus = type;
    this.orderPage.status = type  == 5? "" : type;
    this.orderList(1);
  }

}
