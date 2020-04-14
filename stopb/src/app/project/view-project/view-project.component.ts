import { Component, OnInit } from '@angular/core';
import { Project } from "../../shared/interface/Project";
import { ProjectService } from "../../shared/services/project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from '../../shared/interface/Task';

@Component({
  selector: 'app-readProject',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss'],
})
export class ViewProjectComponent implements OnInit {

  formPlan: Project = null;
  formTask: Task = null;

  inputTaskField: boolean;

  arr = new Array(14);

  constructor(
    private planService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    console.log(this.activatedRoute);
    this.activatedRoute.paramMap.subscribe(param => {
      const id = param.get('id');
      if (!id) {
        // trong truong hop k co id tren url thi tu ve dashboard
        this.router.navigateByUrl('/dashboard');
      } else {
        this.readProject(id);
      }
    });
    this.inputTaskField = true;
  }

  ngOnInit(): void {
  }

  getInputTaskFieldActivate() {
    this.inputTaskField = false;
  }

  getInputTaskFieldDisable() {
    this.inputTaskField = true;
  }

  readProject(id: string) {
    return this.planService.readProject(id).subscribe((data: Project) => {
      this.formPlan = data;
      console.log(data);
    });
  }
}
