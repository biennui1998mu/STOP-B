import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models/Breadcrumb';
import { UiStateService } from '../../services/state/ui-state.service';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { UserQuery } from '../../services/user';

@Component({
  selector: 'app-router-breadcrumb',
  templateUrl: './router-breadcrumb.component.html',
  styleUrls: ['./router-breadcrumb.component.scss'],
})
export class RouterBreadcrumbComponent {

  breadcrumbState: Observable<Breadcrumb>;
  user = this.userQuery.select();

  constructor(
    private uiStateService: UiStateService,
    private dialog: MatDialog,
    private userQuery: UserQuery,
  ) {
    this.breadcrumbState = this.uiStateService.pageTitle;
  }

  openDialogSetting(): void {
    this.dialog.open(AccountMenuComponent, {
      position: {
        top: `calc(4rem + 2px)`,
        right: `1rem`,
      },
      width: '200px',
      backdropClass: `bg-transparent`,
      panelClass: `setting-modal-box`,
    });
  }
}
