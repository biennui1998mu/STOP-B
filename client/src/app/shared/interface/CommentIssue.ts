export interface CommentIssue<task = string, user = string> {
  _id: string;
  content: string;
  task: task;
  createdBy: user;
  createdAt: string;
  updatedAt: string;
}
