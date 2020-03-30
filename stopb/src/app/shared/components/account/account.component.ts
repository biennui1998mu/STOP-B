import {Component, OnInit} from '@angular/core';
import {AuthorizeService} from "../../../services/authorize.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(
    private authorizeService: AuthorizeService,
    public dialog: MatDialogRef<AccountComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.authorizeService.logout();
    this.dialog.close();
  }

  closeDialog(event: MouseEvent): void{
    this.dialog.close();
  }
}
