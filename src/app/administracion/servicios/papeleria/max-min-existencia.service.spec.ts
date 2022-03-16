import { TestBed } from '@angular/core/testing';

import { MaxMinExistenciaService } from './max-min-existencia.service';

describe('MaxMinExistenciaService', () => {
  let service: MaxMinExistenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaxMinExistenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
