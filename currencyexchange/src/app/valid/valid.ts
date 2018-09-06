import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";

export function mobileValidator(control:FormControl): any {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  let valid = myreg.test(control.value);
  // console.log("mobile的校验结果是:"+valid);
  return valid ? null : {mobile : true};
}

export function mobileAsyncValidator(control:FormControl): any {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  let valid = myreg.test(control.value);
  // console.log("mobile的校验结果是:"+valid);
  return Observable.of(valid ? null : {mobile : true}).delay(5000);
}

export function pwdValidator(control:FormControl): any {
  var myreg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
  let valid = myreg.test(control.value);
  return valid ? null : {pwd : true};
}

export function emailValidator(control:FormControl): any {
  var myreg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  let valid = myreg.test(control.value);
  return valid ? null : {email : true};
}


//保留6位小数
export function decimalValidator(control:FormControl): any {
  var myreg = /^(([1-9]\d*(\.\d{0,5}[1-9])?)|(0\.\d{0,5}[1-9]))$/;
  let valid = myreg.test(control.value);
  return valid ? null : {decimal : true};
}

//保留2位小数
export function towBitsValidator(control:FormControl): any {
  var myreg = /^(([1-9]\d*(\.\d{0,1}[1-9])?)|(0\.\d{0,1}[1-9]))$/;
  let valid = myreg.test(control.value);
  return valid ? null : {towBits : true};
}


export function equalValidator(group: FormGroup) : any {
  let password:FormControl = group.get("password") as FormControl;
  let pconfirm:FormControl = group.get("pconfirm") as FormControl;
  let valid:boolean = false;
  if(password && pconfirm){
    valid = (password.value === pconfirm.value);
  }
  return valid ? null : {equal: true};
}
