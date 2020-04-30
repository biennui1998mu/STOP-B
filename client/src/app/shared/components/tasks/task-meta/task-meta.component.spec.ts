import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMetaComponent } from './task-meta.component';

describe('TaskMetaComponent', () => {
  let component: TaskMetaComponent;
  let fixture: ComponentFixture<TaskMetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
