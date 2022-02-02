import { TestBed, inject } from '@angular/core/testing';

import { SucursalService } from './sucursal.service';

describe('SucursalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SucursalService]
    });
  });

  it('should be created', inject([SucursalService], (service: SucursalService) => {
    expect(service).toBeTruthy();
  }));
});
