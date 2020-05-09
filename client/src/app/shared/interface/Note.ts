export interface Note<project = any, user = string> {
  _id?: string,
  UserId: user,
  Title: string,
  Description: string,
  Priority: number,
  StartDate?: string,
  Status: boolean,
  noteProjectId?: project,
}
