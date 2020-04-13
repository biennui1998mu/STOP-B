import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../../services/authorize.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-setting',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
})
export class QuickAccessComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<QuickAccessComponent>,
    private authorizeService: AuthorizeService,
  ) {
  }

  ngOnInit(): void {
  }

  logout() {
    console.log('logout');
    this.authorizeService.logout();
    this.dialogRef.close();
  }
}
