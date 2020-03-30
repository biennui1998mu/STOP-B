import {Component, OnInit} from '@angular/core';
import {UiStateService} from '../../shared/services/state/ui-state.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Note} from "../../shared/interface/Note";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

export class HomepageComponent implements OnInit {

  title: string;
  dob: string;

  notes: Note[] = [];

  constructor(
    private uiStateService: UiStateService,
    private http: HttpClient) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Dashboard',
        path: '/dashboard',
      },
    });
  }

  ngOnInit(): void {
    this.getNote();
  }

  getNote() {
    const header = new HttpHeaders({
      "Authorization": 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get<{
      count: number,
      notes: Note[]
    }>(
      'http://localhost:3000/notes', {
        headers: header
      }
    ).subscribe(notes => {
      this.notes = notes.notes;
    });
  }
}

