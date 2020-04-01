import {Component, OnInit} from '@angular/core';
import {UiStateService} from '../../shared/services/state/ui-state.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Note} from "../../shared/interface/Note";
import {NoteService} from "../../services/note.service";
import {PlanService} from "../../services/plan.service";
import {Plan} from "../../shared/interface/Plan";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

export class HomepageComponent implements OnInit {

  title: string;
  dob: string;

  notes: Note[] = [];
  plans: Plan[] = [];

  constructor(
    private uiStateService: UiStateService,
    private http: HttpClient,
    private noteService: NoteService,
    private planService: PlanService
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Dashboard',
        path: '/dashboard',
      },
    });
  }

  ngOnInit(): void {
    this.getNote();
    this.getPlan();
  }

  getNote() {
    this.noteService.getNote().subscribe(result => {
      this.notes = result.notes
    })
  }

  getPlan() {
    this.planService.getPlan().subscribe( result => {
      this.plans = result.plans
    })
  }
}

