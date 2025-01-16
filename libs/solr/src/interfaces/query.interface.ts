export type TRangeQuery = `[${string} TO ${string}]`;
export type TWildcardQuery = `${string}*` | `*${string}` | `*${string}*`;
export type TFuzzyQuery = `${string}~` | `${string}~${number}`;
export type TProximityQuery = `"${string}"~${number}`;
export type TBoostQuery = `${string}^${number}`;
export type TMultiValueQuery = `(${string})`;
export type TExcludeQuery = `NOT ${string}` | `-${string}`;
export type TRequiredQuery = `+${string}`;
export type TComparison =
  | `<=${string}`
  | `>=${string}`
  | `<${string}`
  | `>${string}`;
export type TLocalParamsQuery = `{!${string}}${string}`;
export type TNestedQuery = `_query_:"${string}"`;
export type TFunctionQuery = `{!func}${string}`;
export type TTaggedQuery = `{!tag=${string}}${string}`;

export type TSolrQueryValue<T> =
  | T
  | TRangeQuery
  | TWildcardQuery
  | TFuzzyQuery
  | TProximityQuery
  | TBoostQuery
  | TMultiValueQuery
  | TExcludeQuery
  | TRequiredQuery
  | TComparison
  | TLocalParamsQuery
  | TNestedQuery
  | TFunctionQuery
  | TTaggedQuery
  | `${string} AND ${string}`
  | `${string} OR ${string}`
  | `[* TO ${string}]`
  | `[${string} TO *]`
  | '*';
