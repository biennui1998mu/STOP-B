import {Component} from '@angular/core';
import {SocketService} from "./services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'stopb';

  constructor(
    private socketService: SocketService
  ) {
    // Kết nối socket io và gán token
    this.socketService.setupSocketConnection();
  }
}
