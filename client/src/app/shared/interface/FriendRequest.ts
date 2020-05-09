export interface FriendRequest<T = any> {
  _id: string,
  requester: T,
  recipient: T,
  status: number
}
