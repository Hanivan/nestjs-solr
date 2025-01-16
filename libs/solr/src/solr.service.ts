import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { BucketBuilder } from './bucket-builder';
import { ISolrDocument, ISolrModuleOptions } from './interfaces/base.interface';
import { IBucketFacetOptions } from './interfaces/facet.interface';
import { IGroupOptions } from './interfaces/group.interface';
import { IHighlightOptions } from './interfaces/highlight.interface';
import { TSolrQueryValue } from './interfaces/query.interface';
import { TSortField } from './interfaces/sort.interface';
import { ISpellcheckOptions } from './interfaces/spellcheck.interface';
import { IStatsOptions } from './interfaces/stats.interface';
import { QueryBuilder } from './query-builder';
import { SOLR_OPTIONS } from './solr.constants';

@Injectable()
export class SolrService<
  T extends Record<string, any> = any,
> extends QueryBuilder {
  private readonly logger = new Logger(SolrService.name);
  private currentCore: string;

  constructor(
    @Inject(SOLR_OPTIONS)
    private readonly options: ISolrModuleOptions,
    private readonly httpService: HttpService,
  ) {
    super();
    this.currentCore = options.defaultCore || options.cores[0];
  }

  private get baseUrl(): string {
    return `http://${this.options.host}:${this.options.port}/solr/${this.currentCore}`;
  }

  bucket(name: string, query: string): BucketBuilder {
    return new BucketBuilder(this, name, query);
  }

  addBucketFacet(name: string, options: IBucketFacetOptions): this {
    if (!this.jsonFacets) {
      this.jsonFacets = {};
    }
    this.jsonFacets[name] = options;
    return this;
  }

  q(query: { [K in keyof T]?: TSolrQueryValue<T[K]> } = {}): this {
    const queryParts = Object.entries(query)
      .map(([field, value]) => {
        if (value === null || value === undefined) return null;
        return `${field}:${this.escapeValue(value)}`;
      })
      .filter(Boolean);

    this.queryParams.q = queryParts.join(' AND ') || '*:*';
    return this;
  }

  fl(fields: Array<keyof T & string>): this {
    this.fieldList = fields;
    return this;
  }

  matchFilter(
    field: keyof T & string,
    value: TSolrQueryValue<T[typeof field]>,
  ): this {
    this.filterQueries.push(`${field}:${this.escapeValue(value)}`);
    return this;
  }

  sort(fields: TSortField<T>): this {
    this.sortFields.push(fields);
    return this;
  }

  highlight(options: IHighlightOptions): this {
    this.highlightOptions = options;
    return this;
  }

  group(options: IGroupOptions): this {
    this.groupOptions = options;
    return this;
  }

  spellcheck(options: ISpellcheckOptions): this {
    this.spellcheckOptions = options;
    return this;
  }

  stats(options: IStatsOptions): this {
    this.statsOptions.push(options);
    return this;
  }

  async switchCore(coreName: string): Promise<this> {
    if (!this.options.cores.includes(coreName)) {
      throw new Error(`Core ${coreName} is not configured`);
    }
    this.currentCore = coreName;
    return this;
  }

  async execute(): Promise<any> {
    const params = this.build();

    this.logger.debug('query');
    this.logger.debug(JSON.stringify(params, null, 2));

    const response = await lastValueFrom(
      this.httpService
        .get(`${this.baseUrl}/select`, {
          params: {
            wt: 'json',
            ...params,
          },
        })
        .pipe(
          catchError((error) => {
            this.logger.error(error);

            return throwError(() => error);
          }),
        ),
    );
    return response.data;
  }

  async add(documents: ISolrDocument | ISolrDocument[]): Promise<void> {
    const docs = Array.isArray(documents) ? documents : [documents];
    await lastValueFrom(
      this.httpService.post(`${this.baseUrl}/update?commit=true`, docs),
    );
  }

  async delete(ids: string | string[]): Promise<void> {
    const deleteIds = Array.isArray(ids) ? ids : [ids];
    const deleteQuery = deleteIds.map((id) => `id:${id}`).join(' OR ');

    this.logger.debug('query');
    this.logger.debug(JSON.stringify(deleteQuery, null, 2));

    await lastValueFrom(
      this.httpService.post(`${this.baseUrl}/update?commit=true`, {
        delete: { query: deleteQuery },
      }),
    );
  }

  async deleteAll(): Promise<void> {
    await lastValueFrom(
      this.httpService.post(`${this.baseUrl}/update?commit=true`, {
        delete: { query: '*:*' },
      }),
    );
  }
}
