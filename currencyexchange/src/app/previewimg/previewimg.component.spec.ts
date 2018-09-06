import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewimgComponent } from './previewimg.component';

describe('PreviewimgComponent', () => {
  let component: PreviewimgComponent;
  let fixture: ComponentFixture<PreviewimgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewimgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
