import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models/Breadcrumb';
import { UiStateService } from '../../services/state/ui-state.service';
import { QuickAccessComponent } from '../quick-access/quick-access.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from "../../interface/User";
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-router-breadcrumb',
  templateUrl: './router-breadcrumb.component.html',
  styleUrls: ['./router-breadcrumb.component.scss'],
})
export class RouterBreadcrumbComponent implements OnInit {

  breadcrumbState: Observable<Breadcrumb>;
  user: User = null;

  constructor(
    private uiStateService: UiStateService,
    private dialog: MatDialog,
    private userService: UserService,
  ) {
    this.breadcrumbState = this.uiStateService.pageTitle;
  }

  ngOnInit(): void {
    this.getUserData();
  }

  openDialogSetting(): void {
    this.dialog.open(QuickAccessComponent, {
      position: {
        top: `calc(4rem + 2px)`,
        right: `1rem`,
      },
      width: '200px',
      backdropClass: `bg-transparent`,
      panelClass: `setting-modal-box`,
    });
  }

  getUserData() {
    return this.userService.getUserData()
      .subscribe((result: User) => {
        if (result) {
          this.user = result;
        }
      });
  }
}
