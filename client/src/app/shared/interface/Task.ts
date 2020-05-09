export interface Task<user = string, project = string> {
  _id: string;
  /**
   * Identifier for each task, like GitHub
   */
  indicator: number;
  title: string;
  description: string;
  /**
   * default can start at the time create the task or can be another time.
   */
  startDate: string;
  /**
   * can be null
   */
  endDate: string;
  /**
   * 0 = open
   * 1 = closed
   */
  status: TASK_STATUS;
  /**
   * from 0->3
   * 0 = none; 1 = low; 2 = medium; 3 = high
   */
  priority: number;
  /**
   * The person who create the issue
   */
  issuer: user;
  /**
   * belongs to what project
   */
  project: project;
  /**
   * Who needs to do this task
   */
  assignee: user;
  /**
   * comment in the issues
   */
  comment?: any;

  updatedAt: string;
  createdAt: string;
}

export enum TASK_STATUS {
  open,
  closed
}
