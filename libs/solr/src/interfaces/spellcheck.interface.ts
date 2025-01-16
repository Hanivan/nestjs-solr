export interface ISpellcheckOptions {
  count?: number;
  onlyMorePopular?: boolean;
  extendedResults?: boolean;
  collate?: boolean;
  maxCollations?: number;
  maxCollationTries?: number;
  maxCollationEvaluations?: number;
  collateExtendedResults?: boolean;
  dictionary?: string | string[];
}
