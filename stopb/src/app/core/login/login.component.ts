import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private uiStateService: UiStateService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'login',
        path: '/login',
      },
    });
  }

  ngOnInit(): void {
  }

}
