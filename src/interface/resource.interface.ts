export type Resource<T> = {
  count: number;
  next: string;
  previous?: string;
  results: T[];
};
