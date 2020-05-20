import { Component, Input, OnInit } from '@angular/core';
import { timeEndBefore } from '../../../tools';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project, ProjectPriority } from '../../../interface/Project';
import { User } from '../../../interface/User';
import { ProjectsQuery, ProjectsService } from '../../../services/projects';

@Component({
  selector: 'app-info-manages',
  templateUrl: './info-manages.component.html',
  styleUrls: ['./info-manages.component.scss'],
})
export class InfoManagesComponent implements OnInit {
  @Input()
  project: Project<User>;

  projectFormInfo: FormGroup;
  readonly ProjectPriority = ProjectPriority;

  title = new FormControl('', [
    Validators.required, Validators.minLength(2),
  ]);

  description = new FormControl('', [
    Validators.maxLength(200),
  ]);

  colorCover = new FormControl('', [
    Validators.maxLength(7),
    Validators.minLength(4),
    Validators.required,
    Validators.pattern(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  ]);

  colorText = new FormControl('', [
    Validators.maxLength(7),
    Validators.minLength(4),
    Validators.required,
    Validators.pattern(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
  ]);

  priority = new FormControl(ProjectPriority.medium, [
    Validators.required,
  ]);

  startDate = new FormControl({
    value: null, disabled: true,
  }, [
    Validators.required,
  ]);

  endDate = new FormControl(null, [
    Validators.required,
  ]);

  constructor(
    private projectsQuery: ProjectsQuery,
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
  ) {
    this.projectFormInfo = this.formBuilder.group({
      title: this.title,
      description: this.description,
      priority: this.priority,
      colorCover: this.colorCover,
      colorText: this.colorText,
      startDate: this.startDate,
      endDate: this.endDate,
    }, {
      validators: timeEndBefore,
    });
  }

  ngOnInit(): void {
    this.setupForm();
  }

  setupForm() {
    this.title.setValue(this.project.title);
    this.description.setValue(this.project.description);
    this.priority.setValue(this.project.priority);
    this.colorCover.setValue(this.project.colorCover);
    this.colorText.setValue(this.project.colorText);
    this.startDate.setValue(this.project.startDate);
    this.endDate.setValue(this.project.endDate);
  }

  resetForm() {
    this.projectFormInfo.reset();
    this.setupForm();
  }

  updateProject() {
    const projectInfo: Partial<Project> = {
      _id: this.project._id,
      title: this.title.value,
      description: this.description.value,
      priority: this.priority.value,
      colorCover: this.colorCover.value,
      colorText: this.colorText.value,
      endDate: this.endDate.value,
    };
    this.projectsService.update(projectInfo).subscribe(data => {
      setTimeout(() => {
        // wait for active state update
        if (data) {
          // this.project = data;
          this.resetForm();
        }
      }, 0);
    });
  }
}
