import { TestBed } from '@angular/core/testing';

import { EstadosServiceService } from './estados-service.service';

describe('EstadosServiceService', () => {
  let service: EstadosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
