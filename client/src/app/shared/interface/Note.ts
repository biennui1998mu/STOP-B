export interface Note<project = any, user = string> {
  _id?: string,
  user: user,
  title: string,
  description: string,
  priority: NOTE_Primary,
  status: NOTE_STATUS,
  project?: project,
  createdAt?: Date,
}

export enum NOTE_STATUS {
  doing,
  done,
}

export enum NOTE_Primary {
  normal,
  important,
}
