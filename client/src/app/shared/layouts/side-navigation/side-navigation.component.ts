import { AfterContentInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountComponent } from "../../../features/account/account.component";
import { Router } from '@angular/router';
import { ProjectsQuery, ProjectsService } from '../../services/projects';

@Component({
  selector: 'app-sidenav',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements AfterContentInit {

  noteSectionOpen = false;
  projectSectionOpen = false;

  projects = this.projectsQuery.selectAll();
  projectsLoading = this.projectsQuery.selectLoading();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private projectsQuery: ProjectsQuery,
    private projectsService: ProjectsService,
  ) {
    this.projectsService.get();
  }

  ngAfterContentInit(): void {
    this.extractCurrentURL(this.router.url);
  }

  openDialogAccount(): void {
    const dialogOpen = this.dialog.open(AccountComponent, {
      width: '500px',
      height: '500px',
    });
  }

  defaultSectionClick(project: string, ...routing: string[]) {
    switch (project) {
      case 'note':
        this.noteSectionOpen = true;
        this.projectSectionOpen = false;
        break;
      case 'project':
        this.projectSectionOpen = true;
        this.noteSectionOpen = false;
        break;
    }
    this.router.navigate(routing);
  }

  private extractCurrentURL(url: string) {
    const splitting = url.split(/\//g);
    if (splitting[1] != undefined) {
      const url = splitting[1];
      const spliceAfter = splitting.slice(2);
      this.defaultSectionClick(url, `/${url}`, ...spliceAfter);
    }
  }
}
