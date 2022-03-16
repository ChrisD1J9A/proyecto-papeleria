import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxMinDeExistenciaComponent } from './max-min-de-existencia.component';

describe('MaxMinDeExistenciaComponent', () => {
  let component: MaxMinDeExistenciaComponent;
  let fixture: ComponentFixture<MaxMinDeExistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxMinDeExistenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxMinDeExistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
