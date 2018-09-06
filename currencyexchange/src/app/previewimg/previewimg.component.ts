import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PreviewimgService } from "../service/previewimg.service";

@Component({
  selector: 'app-previewimg',
  templateUrl: './previewimg.component.html',
  styleUrls: ['./previewimg.component.css']
})
export class PreviewimgComponent implements OnInit {

  @Input()
  previewImgObj;
  hasImage:boolean = false;
  @Output()
  previewImgObjChange: EventEmitter<object> = new EventEmitter();

  constructor( private previewimgService : PreviewimgService) {}

  ngOnInit() {
  }

  previewPic(event) {
    if(!event.target.files[0]) {
      return;
    }
    this.previewimgService.readAsDataUrl(event.target.files[0]).then(result => {
      this.previewImgObj = {
        previewImgFile : result,
        fileName : event.target.files[0].name
      }
      this.hasImage = true;
      this.previewImgObjChange.emit(this.previewImgObj);
    })

  }
  remove() {
    this.previewImgObj = "";
    this.hasImage = false;
    this.previewImgObjChange.emit(this.previewImgObj);
  }

}
