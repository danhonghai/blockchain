import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.component.html',
  styleUrls: ['./wechat.component.css']
})
export class WechatComponent implements OnInit {
	page;
	@Input()
	orderInfo
	srcUrl:any;
	constructor(private sanitizer: DomSanitizer) {

	}

	ngOnInit() {
		// console.log(this.orderInfo);
		let ifremsrc = encodeURI("assets/images/wechat.html?imAccid="+this.orderInfo.imAccid+"&imToken="+this.orderInfo.imToken+"&myImAccid="+this.orderInfo.myImAccid+"&myImToken="+this.orderInfo.myImToken+"&orderUserName="+this.orderInfo.orderUserName);
		this.getSafeUrl(ifremsrc);
	}
	getSafeUrl(url){
		this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
