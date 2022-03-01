import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraAdqViewComponent } from './compra-adq-view.component';

describe('CompraAdqViewComponent', () => {
  let component: CompraAdqViewComponent;
  let fixture: ComponentFixture<CompraAdqViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraAdqViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraAdqViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
