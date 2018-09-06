import { TestBed, inject } from '@angular/core/testing';

import { PreviewimgService } from './previewimg.service';

describe('PreviewimgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviewimgService]
    });
  });

  it('should be created', inject([PreviewimgService], (service: PreviewimgService) => {
    expect(service).toBeTruthy();
  }));
});
