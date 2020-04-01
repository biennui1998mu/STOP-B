import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import {NoteService} from "../../services/note.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-qnote',
  templateUrl: './qnote.component.html',
  styleUrls: ['./qnote.component.scss']
})
export class QnoteComponent implements OnInit {

  private url = 'http://localhost:3000';

  public formNote = {
    noteTitle: null,
    notePara: null,
    notePriority: false,
    noteDate: null
  };

  constructor(
    private uiStateService: UiStateService,
    private generalService: NoteService,
    private router: Router
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

  CreateNote(){
    return this.generalService.noteCreate(this.formNote).subscribe(succes => {
      if(succes){
        this.router.navigateByUrl('/dashboard');
      }
    })
  }

}
