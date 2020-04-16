export interface Project {
  _id: string,
  projectTitle: string,
  projectDescription: string,
  projectPriority: number,
  projectStartDate: string,
  projectEndDate: string
  projectStatus: boolean,
  projectManager: string,
  projectModerator: string,
  projectMember: string
}
