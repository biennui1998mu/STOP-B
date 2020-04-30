import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPillComponent } from './task-pill.component';

describe('TaskPillComponent', () => {
  let component: TaskPillComponent;
  let fixture: ComponentFixture<TaskPillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
