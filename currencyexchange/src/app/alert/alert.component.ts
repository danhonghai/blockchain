import { Component, OnInit } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  type:string;
  message: string;
  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertService.changeEvent.subscribe((tipMessage)=>{
       this.type = tipMessage['type'];
       this.message = tipMessage['message'];
       //提示框显示最多3秒消失
       if(this.message){
          setTimeout(() => {
            this.alertService.clear();
          },3000);
       }
    })
  }


}
