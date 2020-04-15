export interface Task {
  _id: string,
  taskTitle: string,
  taskDescription: string,
  taskPriority: number,
  taskStartDate: string,
  taskEndDate: string,
  taskStatus: boolean,
  taskManager: string
}
