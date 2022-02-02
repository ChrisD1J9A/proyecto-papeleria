import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudFViewComponent } from './solicitud-fview.component';

describe('SolicitudFViewComponent', () => {
  let component: SolicitudFViewComponent;
  let fixture: ComponentFixture<SolicitudFViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudFViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudFViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
