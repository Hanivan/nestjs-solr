import { TSolrQueryValue } from './query.interface';

export interface ISolrFieldType {
  _t: TSolrQueryValue<string>; // Text with all query types
  _s: TSolrQueryValue<string>; // String with all query types
  _i: TSolrQueryValue<number>; // Integer with range and comparison
  _l: TSolrQueryValue<number>; // Long with range and comparison
  _f: TSolrQueryValue<number>; // Float with range and comparison
  _d: TSolrQueryValue<number>; // Double with range and comparison
  _dt: TSolrQueryValue<Date | string>; // Date with range and comparison
  _b: boolean; // Boolean (simple)
  _p: TSolrQueryValue<string>; // Point (geo) with range
}

export type TSolrFieldSuffix = keyof ISolrFieldType;
export type TSolrField = `${string}${TSolrFieldSuffix}`;
