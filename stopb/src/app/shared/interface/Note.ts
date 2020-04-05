export interface Note<T = any> {
  _id: string,
  noteTitle: string,
  noteDescription: string,
  notePriority: number,
  noteStartDate: string
  noteStatus: boolean
  noteProjectId?: T
}
