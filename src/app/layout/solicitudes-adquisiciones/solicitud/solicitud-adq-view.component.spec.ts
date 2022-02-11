import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAdqViewComponent } from './solicitud-adq-view.component';

describe('SolicitudAdqViewComponent', () => {
  let component: SolicitudAdqViewComponent;
  let fixture: ComponentFixture<SolicitudAdqViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudAdqViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudAdqViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
