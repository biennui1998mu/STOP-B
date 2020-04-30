export interface Breadcrumb {
  current: {
    title: string;
    path: string;
    color?: string;
    background?: string;
  }
  previous?: {
    title: string;
    path: string;
  }
}
