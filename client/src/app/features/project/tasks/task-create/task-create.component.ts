import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../shared/interface/User';
import { Project } from '../../../../shared/interface/Project';
import { MarkdownService } from '../../../../shared/services/markdown.service';
import * as moment from 'moment';
import { Task } from '../../../../shared/interface/Task';
import { deepImmutableObject } from '../../../../shared/tools';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TasksService } from '../../../../shared/services/task';
import { ProjectsQuery, ProjectsService } from '../../../../shared/services/projects';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: [
    '../style/shared-task-layout.scss',
    './task-create.component.scss',
  ],
})
export class TaskCreateComponent {
  project: Project<User> = null;

  isPreview: boolean = false;
  previewMarkdown: string = '';

  taskForm: FormGroup;
  projectMembers: User[] = [];

  indicator = 'x';

  public title: FormControl = new FormControl({
    value: '', disabled: false,
  }, [
    Validators.required,
  ]);

  public description: FormControl = new FormControl({
    value: '', disabled: false,
  });

  public priority: FormControl = new FormControl({
    value: 0, disabled: false,
  }, [
    Validators.required,
    Validators.min(0),
  ]);

  public startDate: FormControl = new FormControl({
    value: moment(), disabled: false,
  });

  public endDate: FormControl = new FormControl({
    value: '', disabled: false,
  });

  public assignee: FormControl = new FormControl({
    value: [] as User[], disabled: false,
  });

  constructor(
    private fb: FormBuilder,
    private projectsQuery: ProjectsQuery,
    private markdownService: MarkdownService,
    private taskService: TasksService,
    private router: Router,
  ) {
    this.taskForm = this.fb.group({
      title: this.title,
      description: this.description,
      priority: this.priority,
      startDate: this.startDate,
      endDate: this.endDate,
      assignee: this.assignee,
    });

    this.projectsQuery.selectActive()
      .pipe(
        switchMap(project => {
          if (project) {
            this.project = project;
            this.setupMemberList(project);
          } else {
            this.router.navigate(['/']);
            return of({
              message: 'project did not exist',
              data: null,
            });
          }

          return this.taskService.getLatest(project);
        }),
      )
      .subscribe(task => {
        if (task && task.data) {
          this.indicator = task.data.indicator + 1;
        } else {
          this.indicator = '1';
        }
      });
  }

  preview() {
    this.isPreview = !this.isPreview;
    if (this.isPreview && this.description.valid) {
      this.previewMarkdown = this.markdownService.toMarkdown(
        this.description.value,
      );
    } else {
      this.previewMarkdown = null;
    }
  }

  setupMemberList(project: Project<User>) {
    console.log(project);
    this.projectMembers = [
      project.manager,
      ...project.moderator,
      ...project.member,
    ];
  }

  submitForm() {
    /**
     * prevent pass by reference
     */
    const taskNew: Partial<Task<User, Project<User>>> = deepImmutableObject(this.taskForm.value);
    if (this.taskForm.value.description && this.taskForm.value.description.length > 0) {
      taskNew.description = this.markdownService.sanitizeString(taskNew.description);
    }
    if (this.taskForm.value.startDate) {
      const startDate = moment(this.taskForm.value.startDate);
      taskNew.startDate = startDate.format('x');
    }
    if (this.taskForm.value.endDate) {
      const endDate = moment(this.taskForm.value.endDate);
      taskNew.endDate = endDate.format('x');
    }
    taskNew.project = this.project;

    if (this.taskForm.valid) {
      this.taskService.create(
        taskNew,
      ).subscribe(result => {
        if (result.data) {
          console.log(result);
          this.router.navigate(
            [
              '/project',
              'view',
              this.project._id,
              'tasks',
              result.data.indicator,
            ],
          );
        }
      });
    }
  }
}
