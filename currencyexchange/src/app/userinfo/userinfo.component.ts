import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import { Md5 } from "ts-md5/dist/md5";
import { AlertService } from '../alert/alert.service';
import { User } from '../module/module';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {


  userinfo = new User();
  paymentId;
  constructor(private httpUtilsService: HttpUtilsService,private alertService:AlertService) { }

  ngOnInit() {
    this.userInfo();
  }


  /*个人信息查询*/
  userInfo(){
    this.httpUtilsService.getDataPost("auth/fiatAccount",{},data => {
      this.userinfo = data.data;
    })
  }

  //输入资金密码
  openFundpwdModal(paymentId){
    this.paymentId = paymentId;
    $('#fundpwdModal').modal('show');
  }

  //删除支付方式
  delPayment(obj){
    let params = {
      fundPwd : Md5.hashStr(obj.fundPwd)
    }
    this.httpUtilsService.getDataPost("auth/"+this.paymentId+"/2/mq",params,data => {
      this.alertService.setMessage("删除成功",'success');
      this.userInfo();
      $('#fundpwdModal').modal('hide');
    })
  }


  //启用禁用
  updateStatus(paymentId,status){
    status = status == 1 ? 0 : 1;
    this.httpUtilsService.getDataPost("auth/"+paymentId+"/"+status+"/mq",{},data => {
      this.alertService.setMessage("操作成功！",'success');
      this.userInfo();
    })
  }

}
