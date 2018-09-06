import { Component, OnInit } from '@angular/core';
import { HttpUtilsService } from '../service/http-utils.service';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-business-apply',
  templateUrl: './business-apply.component.html',
  styleUrls: ['./business-apply.component.css']
})
export class BusinessApplyComponent implements OnInit {

  phoneCheck:boolean = false;
  constructor(private httpUtilsService: HttpUtilsService,private router : Router,
    private alertService:AlertService) { }

  ngOnInit() {
  }

  apply(){
    this.httpUtilsService.getDataPost("auth/bm",{},data => {
      this.alertService.setMessage("商家申请成功！",'success');
      this.router.navigate(['/advertising']);
    })
  }

}
