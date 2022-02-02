import { TestBed } from '@angular/core/testing';

import { PerfilSistemaService } from './perfil-sistema.service';

describe('PerfilSistemaService', () => {
  let service: PerfilSistemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilSistemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
