export interface Message<user = string> {
  _id?: string,
  roomId: string,
  message: string,
  from: user,
  createdAt: string
}
