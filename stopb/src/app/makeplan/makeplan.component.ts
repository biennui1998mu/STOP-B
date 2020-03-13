import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-makeplan',
  templateUrl: './makeplan.component.html',
  styleUrls: ['./makeplan.component.scss']
})
export class MakeplanComponent implements OnInit {

  members = new FormControl();
  memberlist: string[] = ['Namhoang Do', 'QHuy', 'Tuananh Nguyen', 'Khue Pham'];
  tasks = ['task 1'];

  constructor() { }

  ngOnInit(): void {
  }

  addTask() {
    this.tasks.push('New task');
  }

  removetask() {
    this.tasks.splice(1,1);
  }


}
