import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosFDCViewComponent } from './productos-fdcview.component';

describe('ProductosFDCViewComponent', () => {
  let component: ProductosFDCViewComponent;
  let fixture: ComponentFixture<ProductosFDCViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosFDCViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosFDCViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
