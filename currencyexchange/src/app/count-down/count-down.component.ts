import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit {

  @Input()
  leftTime:number = 0;
  minute :number = 0;
  second :number = 0;
  @Output()
  leftTimeChange:EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.countDown(this.leftTime);

  }

  //倒计时组件
  countDown(leftTime){
    var timer=null;
    timer=setInterval(function(){
      var minute = 0,second = 0;
      if(leftTime > 0){
        minute = Math.floor(leftTime / 60);
        second = Math.floor(leftTime) - (minute * 60);
      }

      if (minute <= 9) {
        this.minute = '0' + minute;
      }else{
        this.minute = minute;
      };
      if (second <= 9) {
        this.second = '0' + second;
      }else{
        this.second = second;
      };
      leftTime--;
    },1000);
    if(leftTime<=0){
      clearInterval(timer);
      this.leftTimeChange.emit(leftTime);
    }
  }

}
