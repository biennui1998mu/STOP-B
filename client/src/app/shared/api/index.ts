import { environment } from '../../../environments/environment';

export const host = environment.host;

export const apiRoute = (subject: string) => {
  return `${host}/${subject}`;
};
