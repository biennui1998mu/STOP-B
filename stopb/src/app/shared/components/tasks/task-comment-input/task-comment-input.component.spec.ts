import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCommentInputComponent } from './task-comment-input.component';

describe('TaskCommentInputComponent', () => {
  let component: TaskCommentInputComponent;
  let fixture: ComponentFixture<TaskCommentInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCommentInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCommentInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
