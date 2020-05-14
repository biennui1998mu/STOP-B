export interface Note<project = any, user = string> {
  _id?: string,
  user: user,
  title: string,
  description: string,
  priority: number,
  createdAt?: string,
  status: boolean,
  project?: project,
}
