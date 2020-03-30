import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {User} from "../shared/interface/User";

@Injectable({
  providedIn: 'root'
})
export class DataStateService {

  private _userData: BehaviorSubject<User> = new BehaviorSubject(null);
  public userData = this._userData.asObservable();

  constructor() {
  }

  saveUserState(user: User) {
    this._userData.next(user);
  }
}
