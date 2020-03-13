import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QnoteComponent } from './qnote.component';

describe('QnoteComponent', () => {
  let component: QnoteComponent;
  let fixture: ComponentFixture<QnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
