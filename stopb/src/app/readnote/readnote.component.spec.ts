import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadnoteComponent } from './readnote.component';

describe('ReadnoteComponent', () => {
  let component: ReadnoteComponent;
  let fixture: ComponentFixture<ReadnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
