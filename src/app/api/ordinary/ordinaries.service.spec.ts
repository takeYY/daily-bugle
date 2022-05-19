import { TestBed } from '@angular/core/testing';

import { OrdinariesService } from './ordinaries.service';

describe('OrdinariesService', () => {
  let service: OrdinariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdinariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
