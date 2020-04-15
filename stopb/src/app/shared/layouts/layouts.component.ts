import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UiStateService } from '../services/state/ui-state.service';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../models/Breadcrumb';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss'],
})
export class LayoutsComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  breadcrumbState: Observable<Breadcrumb>;

  constructor(
    private uiStateService: UiStateService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
  ) {
    this.breadcrumbState = this.uiStateService.pageTitle;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
