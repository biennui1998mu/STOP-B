export interface Project<Populate = string> {
  _id: string,
  title: string,
  description: string,
  priority: number,
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
