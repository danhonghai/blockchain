import { Component,ViewChild,OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {

 appStyle;
  ngOnInit() {
     window.onload = () =>{
      let clientHeight = window.innerHeight-222;
      this.appStyle = {"min-height": clientHeight+'px'};
    }
  }
}
