export class Order {
  appealPassword:string;
  currentTime:string;
  imAccid:string;
  imToken:string;
  myImAccid:string;
  myImToken:string;
  myNickName:string;
  orderAmount:number;
  orderCoinName:string;
  orderDirect:number
  orderFiatType:string;
  orderNo:number;
  orderPerPrice:number;
  orderStatus:number;
  orderTime:string;
  orderTotalPrice:number;
  orderUserName:string;
  paymentInfoList:object[];
  transReferenceNo:number;
}


export class User {
  certification:number;
  email:string;
  fundSite:boolean;
  googleAuth:boolean;
  identification:boolean;
  isMerchant:boolean;
  nickName:string;
  paymentInfoList:object[];
  phone:string;
  pwdSite:boolean;
  tradeNumber:number;
}

