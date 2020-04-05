export interface Note {
  _id: string,
  noteUserId: string,
  noteTitle: string,
  noteDescription: string,
  notePriority: number,
  noteStartDate: string,
  noteStatus: boolean,
  noteProjectId: string
}
