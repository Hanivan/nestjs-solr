export interface IBaseFacetOptions {
  domain?: {
    filter?: string;
    excludeTags?: string[];
  };
  mincount?: number;
  limit?: number;
  sort?: 'count' | 'index';
}

export interface ITermsFacetOptions extends IBaseFacetOptions {
  type: 'terms';
  field: string;
  facet?: Record<string, any>;
}

export interface IRangeFacetOptions extends IBaseFacetOptions {
  type: 'range';
  field: string;
  start: number | string;
  end: number | string;
  gap: number | string;
  hardend?: boolean;
  facet?: Record<string, any>;
}

export interface IBucketFacetOptions extends IBaseFacetOptions {
  type: 'query';
  q: string;
  facet?: Record<string, any>;
}

export type TFacetOptions =
  | ITermsFacetOptions
  | IRangeFacetOptions
  | IBucketFacetOptions;
