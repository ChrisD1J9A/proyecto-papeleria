import { TestBed } from '@angular/core/testing';

import { JerarquiaRegionalService } from './jerarquia-regional.service';

describe('JerarquiaRegionalService', () => {
  let service: JerarquiaRegionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JerarquiaRegionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
