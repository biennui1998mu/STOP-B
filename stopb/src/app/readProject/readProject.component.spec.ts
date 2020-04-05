import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadplanComponent } from './readProject.component';

describe('ReadplanComponent', () => {
  let component: ReadplanComponent;
  let fixture: ComponentFixture<ReadplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReadplanComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
