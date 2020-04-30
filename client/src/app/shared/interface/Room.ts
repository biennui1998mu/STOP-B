export interface Room<T = string> {
  _id: string,
  listUser: T[],
  createdAt: string,
}
