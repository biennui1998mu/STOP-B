import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../services/state/ui-state.service';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../models/Breadcrumb';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss'],
})
export class LayoutsComponent implements OnInit {

  breadcrumbState: Observable<Breadcrumb>;

  constructor(
    private uiStateService: UiStateService,
  ) {
    this.breadcrumbState = this.uiStateService.pageTitle;
  }

  ngOnInit(): void {
  }

}
