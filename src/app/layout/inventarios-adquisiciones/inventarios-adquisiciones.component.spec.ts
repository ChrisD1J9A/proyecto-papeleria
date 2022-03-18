import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosAdquisicionesComponent } from './inventarios-adquisiciones.component';

describe('InventariosAdquisicionesComponent', () => {
  let component: InventariosAdquisicionesComponent;
  let fixture: ComponentFixture<InventariosAdquisicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventariosAdquisicionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariosAdquisicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
