import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesAdquisicionesComponent } from './solicitudes-adquisiciones.component';

describe('SolicitudesAdquisicionesComponent', () => {
  let component: SolicitudesAdquisicionesComponent;
  let fixture: ComponentFixture<SolicitudesAdquisicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesAdquisicionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesAdquisicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
