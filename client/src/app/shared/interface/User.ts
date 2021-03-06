import { FriendRequest } from './FriendRequest';

export interface User {
  _id?: string,
  username: string,
  password?: string,
  name: string,
  dob: string,
  status: number,
  avatar: string

  customMode?: string;
  friendRequest?: Partial<FriendRequest<any>>;
}
