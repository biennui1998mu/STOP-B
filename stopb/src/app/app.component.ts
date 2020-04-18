import { Component } from '@angular/core';
import { SocketService } from "./shared/services/socket.service";
import { FriendService } from './shared/services/friend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'stopb';

  constructor(
    private socketService: SocketService,
    private friendService: FriendService,
  ) {
    // Kết nối socket io và gán token
    this.socketService.setupSocketConnection();

    // get friend
    this.friendService.getFriendRequests();
  }
}
