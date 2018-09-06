import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PreviewimgService } from "../service/previewimg.service";
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.css']
})
export class UploadPictureComponent implements OnInit {

  @Input()
  previewImgObj;
  hasImage:boolean = false;
  @Output()
  previewImgObjChange: EventEmitter<object> = new EventEmitter();

  constructor( private previewimgService : PreviewimgService,private alertService:AlertService) {
  }

  ngOnInit() {
  }

  previewPic(event) {
    if(!event.target.files[0]) {
      return;
    }
    this.previewimgService.readAsDataUrl(event.target.files[0]).then(result => {
      let size = event.target.files[0].size/1024/1024;
      if(size > 10){
        this.alertService.setMessage("图片大小不能超过10M");
        return false;
      }
      this.previewImgObj = {
        previewImgFile : result,
        fileName : event.target.files[0].name
      }
      this.hasImage = true;
      //this.previewImgFile = result;
      this.previewImgObjChange.emit(this.previewImgObj);
    })

  }
  remove() {
    this.previewImgObj = "";
    this.hasImage = false;
    this.previewImgObjChange.emit(this.previewImgObj);
  }

}
