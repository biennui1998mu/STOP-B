import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkdownService } from '../../../../services/markdown.service';
import { Task, TASK_STATUS } from '../../../../interface/Task';
import { Project } from '../../../../interface/Project';
import { User } from '../../../../interface/User';
import { UserQuery } from '../../../../services/user';
import { CommentsService } from '../../../../services/task-comments';
import { switchMap } from 'rxjs/operators';
import { TasksService } from '../../../../services/task';
import { of } from 'rxjs';

@Component({
  selector: 'app-task-comment-input',
  templateUrl: './task-comment-input.component.html',
  styleUrls: ['../../styles/task-comment.scss'],
})
export class TaskCommentInputComponent implements OnInit {
  @Input()
  task: Task<User, Project>;

  @Input()
  project: Project<User>;

  @ViewChild('textAreaElement')
  textAreaElement: ElementRef<HTMLTextAreaElement>;

  user = this.userQuery.getValue();

  formInput: FormGroup;

  previewMarkdown: string;
  isPreview: boolean = false;
  minHeightPreview: number;

  TASK_STATUS = TASK_STATUS;

  constructor(
    private fb: FormBuilder,
    private markdown: MarkdownService,
    private userQuery: UserQuery,
    private taskCommentService: CommentsService,
    private tasksService: TasksService,
  ) {
    this.formInput = this.fb.group({
      content: ['', [Validators.required]],
      images: [null, [Validators.maxLength(10)]],
      tasks: [null],
    });
  }

  get content() {
    return this.formInput.get('content');
  }

  get images() {
    return this.formInput.get('images');
  }

  get tasks() {
    return this.formInput.get('tasks');
  }

  ngOnInit(): void {
  }

  preview() {
    const getCurrentHeight = this.textAreaElement.nativeElement.offsetHeight;
    this.isPreview = !this.isPreview;
    if (this.isPreview && this.content.valid) {
      this.minHeightPreview = getCurrentHeight;
      this.previewMarkdown = this.markdown.toMarkdown(
        this.content.value,
      );
    } else {
      this.minHeightPreview = null;
      this.previewMarkdown = null;
    }
  }

  comment(andClose: boolean = false) {
    this.taskCommentService.create(
      this.task._id,
      this.project._id,
      this.content.value,
    ).pipe(
      switchMap(comment => {
        if (comment && andClose) {
          return this.tasksService.changeStatus(
            this.task._id,
            this.project._id,
            TASK_STATUS.closed,
          );
        }
        return of(!!comment);
      }),
    ).subscribe(response => {
      console.log(response);
    });
  }
}
