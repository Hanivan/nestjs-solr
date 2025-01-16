export interface IStatsCardinality {
  accuracy?: number;
  precisionThreshold?: number;
}

export interface IStatsOptions {
  field: string;
  facet?: string[];
  calcdistinct?: boolean;
  percentiles?: number[];
  cardinality?: IStatsCardinality;
}
