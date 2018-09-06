import { Injectable,EventEmitter } from '@angular/core';

@Injectable()
export class AlertService {

  private message: string;
  private type:string;
  private tipMessage = {};
  changeEvent: EventEmitter<object> =  new EventEmitter();

  constructor() { }

  //设置消息
  setMessage(message:string ,type:string = "info"){
    this.tipMessage['message'] = message;
    this.tipMessage['type'] = type;
    this.changeEvent.emit(this.tipMessage);
  }

  //获取消息
  getMessage(){
    return this.tipMessage;
  }


  //清除消息
  clear(){
    this.tipMessage = {};
    this.changeEvent.emit(this.tipMessage);
  }


}
