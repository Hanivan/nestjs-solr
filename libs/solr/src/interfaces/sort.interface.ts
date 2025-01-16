export type TSortDirection = 'asc' | 'desc';

export type TSortField<T> = {
  [K in keyof T]?: TSortDirection;
} & {
  score?: TSortDirection;
  _docid_?: TSortDirection;
  [key: string]: TSortDirection | undefined;
};
