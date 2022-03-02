import { TestBed } from '@angular/core/testing';

import { DetalleInventarioService } from './detalle-inventario.service';

describe('DetalleInventarioService', () => {
  let service: DetalleInventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleInventarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
