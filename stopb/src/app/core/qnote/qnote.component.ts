import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';

@Component({
  selector: 'app-qnote',
  templateUrl: './qnote.component.html',
  styleUrls: ['./qnote.component.scss']
})
export class QnoteComponent implements OnInit {

  constructor(
    private uiStateService: UiStateService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Quick Note',
        path: '/note/create',
      },
    });
  }

  ngOnInit(): void {
  }

}
