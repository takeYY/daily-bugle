import { TestBed } from '@angular/core/testing';

import { UsrsOrdinariesService } from './usrs-ordinaries.service';

describe('UsrsOrdinariesService', () => {
  let service: UsrsOrdinariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsrsOrdinariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
