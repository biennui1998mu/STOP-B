export interface Room<user = string> {
  _id: string,
  listUser: user[],
  createdAt: string,
}
