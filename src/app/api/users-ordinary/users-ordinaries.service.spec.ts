import { TestBed } from '@angular/core/testing';

import { UsersOrdinariesService } from './users-ordinaries.service';

describe('UsersOrdinariesService', () => {
  let service: UsersOrdinariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersOrdinariesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
