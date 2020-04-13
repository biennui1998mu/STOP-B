import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
})
export class ChatLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('chatContext')
  chatContext: ElementRef<HTMLDivElement>;

  constructor(
    public dialogRef: MatDialogRef<ChatLayoutComponent>,
  ) {
  }

  ngOnInit(): void {
  }

  closeChat() {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  /**
   * trigger this to scroll the chat to bottom (after every chat)
   */
  scrollToBottom() {
    this.chatContext.nativeElement.scrollTop = this.chatContext.nativeElement.scrollHeight;
  }
}
