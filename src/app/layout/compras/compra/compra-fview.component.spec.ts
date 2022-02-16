import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraFViewComponent } from './compra-fview.component';

describe('CompraFViewComponent', () => {
  let component: CompraFViewComponent;
  let fixture: ComponentFixture<CompraFViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraFViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraFViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
