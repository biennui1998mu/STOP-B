import { environment } from '../../../environments/environment';

export const host = environment.host;
export const socketHost = environment.socket;

export const apiRoute = (subject: string) => {
  return `${host}/${subject}`;
};

export const socketRoute = (subject: string) => {
  return `${socketHost}/${subject}`;
};
