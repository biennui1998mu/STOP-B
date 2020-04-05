export interface Project {
  _id: string,
  projectUserId: string,
  projectTitle: string,
  projectDescription: string,
  projectPriority: number,
  projectStartDate: string,
  projectEndDate: string
  projectStatus: boolean,
  projectTaskID: string,
  projectManager: string,
  projectModerator: string,
  projectMember: string
}
