import { TestBed } from '@angular/core/testing';

import { PerfilTareaService } from './perfil-tarea.service';

describe('PerfilTareaService', () => {
  let service: PerfilTareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilTareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
