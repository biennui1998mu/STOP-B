import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../../shared/services/state/ui-state.service';

@Component({
  selector: 'app-all-project',
  templateUrl: './all-project.component.html',
  styleUrls: ['./all-project.component.scss'],
})
export class AllProjectComponent implements OnInit {

  constructor(
    private uiStateService: UiStateService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Projects',
        path: '/project',
      },
    });
  }

  ngOnInit(): void {
  }

}
