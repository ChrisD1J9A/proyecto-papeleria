import { TestBed } from '@angular/core/testing';

import { DetalleSolicitudPFDCService } from './detalle-solicitud-pfdc.service';

describe('DetalleSolicitudPFDCService', () => {
  let service: DetalleSolicitudPFDCService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleSolicitudPFDCService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
