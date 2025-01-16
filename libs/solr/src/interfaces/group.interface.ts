export interface IGroupOptions {
  field?: string;
  query?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  format?: 'grouped' | 'simple';
  main?: boolean;
  ngroups?: boolean;
  truncate?: boolean;
  facet?: boolean;
  cache?: number;
  cachePercent?: number;
  allGroups?: boolean;
  func?: string | string[];
  functions?: number;
  rows?: number;
  start?: number;
  distanceFacet?: boolean;
}
