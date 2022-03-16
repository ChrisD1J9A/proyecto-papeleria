import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxMinDeStockComponent } from './max-min-de-stock.component';

describe('MaxMinDeStockComponent', () => {
  let component: MaxMinDeStockComponent;
  let fixture: ComponentFixture<MaxMinDeStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxMinDeStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxMinDeStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
