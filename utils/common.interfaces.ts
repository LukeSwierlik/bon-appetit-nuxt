export type Modes = 'system' | 'light' | 'dark';

export interface Repo {
  description?: string;
  stargazers_count: number;
  html_url: string;
  name: string;
  id: string;
}
