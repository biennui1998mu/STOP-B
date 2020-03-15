import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Breadcrumb } from '../../models/Breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {

  private _pageTitle: BehaviorSubject<Breadcrumb> = new BehaviorSubject({
    current: {
      title: 'Dashboard',
      path: '/homepage',
    },
  });
  public pageTitle = this._pageTitle.asObservable();

  constructor() {
  }

  setPageTitle(title: Breadcrumb) {
    this._pageTitle.next(title);
  }
}
