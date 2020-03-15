export interface Breadcrumb {
  current: {
    title: string;
    path: string;
  }
  previous?: {
    title: string;
    path: string;
  }
}
