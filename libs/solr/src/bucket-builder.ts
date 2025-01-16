import {
  IBucketFacetOptions,
  IRangeFacetOptions,
  ITermsFacetOptions,
} from './interfaces/facet.interface';
import { TSolrField } from './interfaces/field.interface';
import { QueryBuilder } from './query-builder';
import { SolrService } from './solr.service';

export class BucketBuilder extends QueryBuilder {
  private facetConfig: IBucketFacetOptions;
  private parentBuilder: SolrService;
  private bucketName: string;

  constructor(parent: SolrService, name: string, query: string) {
    super();
    this.parentBuilder = parent;
    this.bucketName = name;
    this.facetConfig = {
      type: 'query',
      q: query,
      facet: {},
    };
  }

  facet(
    name: string,
    config: ITermsFacetOptions | IRangeFacetOptions | IBucketFacetOptions,
  ): this {
    if (!this.facetConfig.facet) {
      this.facetConfig.facet = {};
    }
    this.facetConfig.facet[name] = config;
    return this;
  }

  termsFacet(
    name: string,
    field: TSolrField,
    options: Omit<ITermsFacetOptions, 'type' | 'field'> = {},
  ): this {
    return this.facet(name, {
      type: 'terms',
      field,
      ...options,
    });
  }

  rangeFacet(
    name: string,
    field: TSolrField,
    start: number | string,
    end: number | string,
    gap: number | string,
    options: Omit<
      IRangeFacetOptions,
      'type' | 'field' | 'start' | 'end' | 'gap'
    > = {},
  ): this {
    return this.facet(name, {
      type: 'range',
      field,
      start,
      end,
      gap,
      ...options,
    });
  }

  subBucket(name: string, query: string): BucketBuilder {
    const subBucket = new BucketBuilder(this.parentBuilder, name, query);
    if (!this.facetConfig.facet) {
      this.facetConfig.facet = {};
    }
    this.facetConfig.facet[name] = subBucket.getFacetConfig();
    return subBucket;
  }

  getFacetConfig(): IBucketFacetOptions {
    return this.facetConfig;
  }

  build(): SolrService {
    this.parentBuilder.addBucketFacet(this.bucketName, this.facetConfig);
    return this.parentBuilder;
  }
}
