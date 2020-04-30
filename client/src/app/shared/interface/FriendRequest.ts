export interface FriendRequest<T = string> {
  _id: string,
  requester: T,
  recipient: T,
  status: number
}
