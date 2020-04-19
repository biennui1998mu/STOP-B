import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogModel } from '../../../interface/ConfirmDialogModel';

@Component({
  selector: 'app-confirm-dialogs',
  templateUrl: './confirm-dialogs.component.html',
  styleUrls: ['./confirm-dialogs.component.scss'],
})
export class ConfirmDialogsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,
    public dialogRef: MatDialogRef<ConfirmDialogsComponent>,
  ) {
    console.log(data);
  }

  ngOnInit(): void {
  }

}
