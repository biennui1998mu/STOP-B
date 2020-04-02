import { Component, OnInit } from '@angular/core';
import { Plan } from "../shared/interface/Plan";
import { PlanService } from "../services/plan.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from '../shared/interface/Task';

@Component({
  selector: 'app-readplan',
  templateUrl: './readplan.component.html',
  styleUrls: ['./readplan.component.scss'],
})
export class ReadplanComponent implements OnInit {

  formPlan: Plan = null;
  formTask: Task = null;

  inputTaskField: boolean;

  arr = new Array(14);

  constructor(
    private planService: PlanService,
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
        this.readPlan(id);
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

  readPlan(id: string) {
    return this.planService.readPlan(id).subscribe((data: Plan) => {
      this.formPlan = data;
      console.log(data);
    });
  }
}
