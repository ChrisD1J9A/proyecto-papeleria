import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioViewComponent } from './inventario-view.component';

describe('InventarioViewComponent', () => {
  let component: InventarioViewComponent;
  let fixture: ComponentFixture<InventarioViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
