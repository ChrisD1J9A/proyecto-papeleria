import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasAdquisicionesComponent } from './compras-adquisiciones.component';

describe('ComprasAdquisicionesComponent', () => {
  let component: ComprasAdquisicionesComponent;
  let fixture: ComponentFixture<ComprasAdquisicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprasAdquisicionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasAdquisicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
