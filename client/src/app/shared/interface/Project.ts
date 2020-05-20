export interface Project<Populate = string> {
  _id: string,
  title: string,
  description: string,
  priority: ProjectPriority,
  colorCover: string,
  colorText: string,

  manager: Populate,
  moderator: Populate[],
  member: Populate[],

  status: boolean,
  startDate: string,
  endDate: string,
  createdAt: string;
}

export enum ProjectPriority {
  medium = 2,
  high = 1,
}
