import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { Router } from "@angular/router";
import { MatVerticalStepper } from '@angular/material/stepper';
import { UserQuery } from '../../../shared/services/user';
import { ProjectsService } from '../../../shared/services/projects';

@Component({
  selector: 'app-makePlan',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  @ViewChild('projectFormCreate')
  projectFormCreate: MatVerticalStepper;

  projectForm: FormGroup;

  constructor(
    private uiStateService: UiStateService,
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
    private userQuery: UserQuery,
    private router: Router,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Create Plan',
        path: '/project/create',
      },
    });
  }

  get title() {
    return this.projectForm.get('title');
  }

  get priority() {
    return this.projectForm.get('priority');
  }

  get description() {
    return this.projectForm.get('description');
  }

  get endDate() {
    return this.projectForm.get('endDate');
  }

  get moderator() {
    return this.projectForm.get('moderator');
  }

  get member() {
    return this.projectForm.get('member');
  }

  get manager() {
    return this.projectForm.get('manager');
  }

  ngOnInit(): void {
    this.projectFormBuilder();
    this.getUserData();
  }

  getUserData() {
    this.manager.setValue(this.userQuery.getValue()._id);
  }

  createProject() {
    return this.projectsService.create(this.projectForm.value).subscribe(success => {
      if (success) {
        this.projectsService.get();
        this.router.navigate(
          ['/project', 'view', success._id],
        );
      }
    });
  }

  private projectFormBuilder() {
    this.projectForm = this.formBuilder.group({
      manager: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      colorCover: ['#14579c'],
      colorText: ['#ffffff'],
      endDate: ['', [Validators.required]],
      moderator: [[], [
        // Validators.required,
        Validators.maxLength(5),
      ]],
      member: [[], [
        // Validators.required,
        Validators.maxLength(50),
      ]],
    });
  }
}
