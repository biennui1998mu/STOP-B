import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeplanComponent } from './makeplan.component';

describe('MakeplanComponent', () => {
  let component: MakeplanComponent;
  let fixture: ComponentFixture<MakeplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
