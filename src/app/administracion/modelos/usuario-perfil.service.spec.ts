import { TestBed } from '@angular/core/testing';

import { UsuarioPerfilService } from './usuario-perfil.service';

describe('UsuarioPerfilService', () => {
  let service: UsuarioPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
