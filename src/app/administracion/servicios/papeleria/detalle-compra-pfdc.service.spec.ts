import { TestBed } from '@angular/core/testing';

import { DetalleCompraPFDCService } from './detalle-compra-pfdc.service';

describe('DetalleCompraPFDCService', () => {
  let service: DetalleCompraPFDCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleCompraPFDCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
