import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { decimalValidator } from '../valid/valid';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-capital',
  templateUrl: './capital.component.html',
  styleUrls: ['./capital.component.css']
})
export class CapitalComponent implements OnInit {


  pageParams;
  option = {//分页信息
      size:10,
      total:0
  };
  dataList : object[] = new Array();
  accountRes;
  totalAssets;
  coinList;
  currentCoin = {
    coinName:''
  };
  myForm : FormGroup;
  params = {
    firstMoney:0,
    lastMoney:0
  };
  currentCoinIndex = 0;
  currentAssetType = 0;

  constructor(
    private httpUtilsService: HttpUtilsService,
    fb : FormBuilder,
    private alertService:AlertService) {
    this.myForm = fb.group({
      coinId:'',
      accountFirst: 1,
      accountLast: 2,
      amount : ['',[Validators.required,decimalValidator]]
    })
    this.pageParams = {
      index:0,
      size:10,
    }
  }

  ngOnInit() {
    this.queryMyCapital();
    this.queryCapitalList(1)
    this.fiatCoinList();
  }

  /*币种列表*/
  fiatCoinList(coinId?){
    this.httpUtilsService.getDataPost("api/fiatCoinList",{},data => {
      this.coinList = data.data;
      if(coinId){
        this.myForm.patchValue({coinId:coinId});
      }else{
        this.coinList.unshift({coinId:'',name:'全部'});
      }
    })
  }

  //切换币种
  switchCoin(id,index){
    this.currentCoinIndex = index;
    this.pageParams['coinId'] = id;
    this.queryCapitalList(1);
  }

  //选择类型
  selectAssetType(type){
    this.currentAssetType = type;
    this.pageParams.assetType = type  == 0? "" : type;
    this.queryCapitalList(1);
  }


  //我的资产
  queryMyCapital(){
    this.httpUtilsService.getDataPost("auth/fa",{},data => {
      this.accountRes = data.data.accountRes;
      this.totalAssets = data.data.totalAssets;
    })
  }

  //资产流水
  queryCapitalList(page){
    this.pageParams['index'] = page - 1;
    this.httpUtilsService.getDataPost("auth/fl",this.pageParams,data => {
      this.dataList = data.data.dataList;
      this.option['index'] = page;
      this.option['all'] = Math.ceil(data.data.total/this.pageParams.size);
      this.option['count'] = data.data.totalIndex>10?10:data.data.totalIndex;
      this.option['total'] = data.data.total;
    })
  }

  //分页
  queryFun(index:any){
    this.queryCapitalList(index);
  }

  //打开资产划转弹窗
  openExampleModal(item){
    this.currentCoin = item;
    this.params['firstMoney'] = this.currentCoin['fiatAccount'].available;
    this.params['lastMoney'] = this.currentCoin['coinAccount'].available;
    this.params['direct'] = 2;
    this.myForm.reset({ accountFirst: 1,accountLast:2,amount:'' });
    this.fiatCoinList(item.coinId);
  }

  //选择币种
  selectCoin(event){
    let coinId = event.target.value;
    for(let i = 0; i< this.accountRes.length; i++){
      if(coinId ==  this.accountRes[i].coinId){
        this.currentCoin = this.accountRes[i];
        if(this.myForm.get('accountFirst').value == 1){//法币
          this.params['firstMoney'] = this.currentCoin['fiatAccount'].available;
          this.params['lastMoney'] = this.currentCoin['coinAccount'].available;
        }else{//币币
          this.params['firstMoney'] = this.currentCoin['coinAccount'].available;
          this.params['lastMoney'] = this.currentCoin['fiatAccount'].available;
        }
      }
    }

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
      this.queryMyCapital();
      this.queryCapitalList(1)
    })
  }

}
