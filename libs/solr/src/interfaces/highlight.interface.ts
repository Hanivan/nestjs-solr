export type THighlightFormatter = 'simple' | 'html';
export type THighlightEncoder = 'html' | 'xml';
export type THighlightFragmenter = 'gap' | 'regex';
export type THighlightBoundaryScanner = 'simple' | 'breakIterator';
export type TBoundaryType = 'WORD' | 'SENTENCE' | 'LINE' | 'CHARACTER';

export interface IBoundaryScannerOptions {
  type: TBoundaryType;
  country?: string;
  language?: string;
}

export interface IHighlightOptions {
  fields?: string[];
  snippets?: number;
  fragsize?: number;
  mergeContiguous?: boolean;
  requireFieldMatch?: boolean;
  maxAnalyzedChars?: number;
  alternateField?: string;
  maxAlternateFieldLength?: number;
  preserveMulti?: boolean;
  payloads?: boolean;
  formatter?: THighlightFormatter;
  encoder?: THighlightEncoder;
  fragmenter?: THighlightFragmenter;
  boundaryScanner?: THighlightBoundaryScanner;
  bs?: IBoundaryScannerOptions;
  prefix?: string;
  postfix?: string;
}
