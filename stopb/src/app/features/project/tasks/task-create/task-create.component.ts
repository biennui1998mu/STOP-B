import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../shared/interface/User';
import { ProjectService } from '../../../../shared/services/project.service';
import { Project } from '../../../../shared/interface/Project';
import { MarkdownService } from '../../../../shared/services/markdown.service';
import * as moment from 'moment';
import { Task } from '../../../../shared/interface/Task';
import { deepMutableObject } from '../../../../shared/tools';
import { TaskService } from '../../../../shared/services/task.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: [
    '../style/shared-task-layout.scss',
    './task-create.component.scss',
  ],
})
export class TaskCreateComponent implements OnInit {
  project: Project<User> = null;

  isPreview: boolean = false;
  previewMarkdown: string = '';

  taskForm: FormGroup;
  projectMembers: User[] = [];

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

  // public images: FormControl = new FormControl({
  //   value: '', disabled: false,
  // }, [
  //   Validators.maxLength(10),
  // ]);
  //
  // public tasks: FormControl = new FormControl({
  //   value: '', disabled: false,
  // });

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private markdownService: MarkdownService,
    private taskService: TaskService,
  ) {
    this.taskForm = this.fb.group({
      title: this.title,
      description: this.description,
      priority: this.priority,
      startDate: this.startDate,
      endDate: this.endDate,
      assignee: this.assignee,
      // images: this.images, TODO future feature
      // tasks: this.tasks, TODO future feature
    });

    this.projectService.activeProject
      .subscribe(project => {
        if (project) {
          this.project = project;
          this.setupMemberList(project);
        }
      });
  }

  ngOnInit(): void {
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
    const taskNew: Partial<Task<User, Project<User>>> = deepMutableObject(this.taskForm.value);
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
      this.taskService.createTask(
        taskNew,
      ).subscribe(result => {
        console.log(result);
      });
    }
  }
}
