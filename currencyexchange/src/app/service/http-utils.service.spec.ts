import { TestBed, inject } from '@angular/core/testing';

import { HttpUtilsService } from './http-utils.service';

describe('HttpUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpUtilsService]
    });
  });

  it('should be created', inject([HttpUtilsService], (service: HttpUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
