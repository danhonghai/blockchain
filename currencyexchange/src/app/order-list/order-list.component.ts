import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  option = {//分页信息
      size:10,
      total:0
  };
  pageParams ;
  dataList : object[] = new Array();
  coinList;
  currentCoinIndex = 0;
  currentFiatType = 0;
  currentDirect = 0;
  currentStatus = 5;

  constructor(private httpUtilsService : HttpUtilsService) {
    this.pageParams = {
      index:0,
      size:10
    }
  }

  ngOnInit() {
    this.fiatCoinList();
  }

  /*币种列表*/
  fiatCoinList(){
    this.httpUtilsService.getDataPost("api/fiatCoinList",{},data => {
      this.coinList = data.data;
      this.coinList.unshift({coinId:'',name:'全部'});
      this.pageParams['coinId'] = this.coinList[0]['coinId'];
      this.myAdList(1);
    })
  }

  //我的广告
  myAdList(page){
    this.pageParams['index'] = page - 1;
    this.httpUtilsService.getDataPost("auth/orderList",this.pageParams,data => {
        this.dataList = data.data.dataList;
        this.option['index'] = page;
        this.option['all'] = Math.ceil(data.data.total/this.pageParams.size);
        this.option['count'] = data.data.totalIndex>10?10:data.data.totalIndex;
        this.option['total'] = data.data.total;
    })
  }

  queryFun(index){
    this.myAdList(index);
  }

  //切换币种
  switchCoin(id,index){
    this.currentCoinIndex = index;
    this.pageParams['coinId'] = id;
    this.myAdList(1);
  }

  //选择法币类型
  selectFiat(fiatType){
    this.currentFiatType = fiatType;
    this.pageParams.fiatType = fiatType  == 0? "" : fiatType ;
    this.myAdList(1);
  }

  //选择交易类型
  selectDirect(type){
    this.currentDirect = type;
    this.pageParams.tradeDirect = type  == 0? "" : type;
    this.myAdList(1);
  }

  //选择交易状态
  selectStatus(type){
    this.currentStatus = type;
    this.pageParams.status = type  == 5? "" : type;
    this.myAdList(1);
  }

}
