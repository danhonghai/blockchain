import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPictureComponent } from './upload-picture.component';

describe('UploadPictureComponent', () => {
  let component: UploadPictureComponent;
  let fixture: ComponentFixture<UploadPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
