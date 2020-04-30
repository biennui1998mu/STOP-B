export interface Note<T = any> {
  _id: string,
  UserId: string,
  Title: string,
  Description: string,
  Priority: number,
  StartDate: string,
  Status: boolean,
  noteProjectId?: T,
}
