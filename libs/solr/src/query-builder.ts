import { IGroupOptions } from './interfaces/group.interface';
import { IHighlightOptions } from './interfaces/highlight.interface';
import { TSortField } from './interfaces/sort.interface';
import { ISpellcheckOptions } from './interfaces/spellcheck.interface';
import { IStatsOptions } from './interfaces/stats.interface';

export class QueryBuilder {
  protected queryParams: Record<string, any> = {
    q: '*:*',
    start: 0,
    rows: 10,
  };
  protected filterQueries: string[] = [];
  protected fieldList: string[] = [];
  protected jsonFacets: Record<string, any> = {};
  protected sortFields: TSortField<any>[] = [];
  protected highlightOptions?: IHighlightOptions;
  protected spellcheckOptions?: ISpellcheckOptions;
  protected groupOptions?: IGroupOptions;
  protected statsOptions: IStatsOptions[] = [];

  start(offset: number): this {
    this.queryParams.start = offset;
    return this;
  }

  rows(limit: number): this {
    this.queryParams.rows = limit;
    return this;
  }

  protected escapeValue(value: any): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'string') {
      return `${value.replace(/["\\]/g, '\\$&')}`;
    }
    return String(value);
  }

  protected build(): Record<string, any> {
    const params: Record<string, any> = {
      ...this.queryParams,
    };

    if (this.filterQueries.length > 0) {
      params.fq = this.filterQueries;
    }

    if (this.fieldList.length > 0) {
      params.fl = this.fieldList.join(',');
    }

    if (Object.keys(this.jsonFacets).length > 0) {
      params['json.facet'] = JSON.stringify(this.jsonFacets);
    }

    // Add sort parameters
    if (this.sortFields.length > 0) {
      params.sort = this.sortFields
        .map((field) =>
          Object.entries(field)
            .map(([key, dir]) => `${key} ${dir}`)
            .join(','),
        )
        .join(',');
    }

    // Add highlighting parameters
    if (this.highlightOptions) {
      params.hl = true;
      if (this.highlightOptions.fields) {
        params['hl.fl'] = this.highlightOptions.fields.join(',');
      }
      // Add other highlight options...
      Object.entries(this.highlightOptions).forEach(([key, value]) => {
        if (key !== 'fields' && value !== undefined) {
          params[`hl.${key}`] = value;
        }
      });
    }

    // Add spellcheck parameters
    if (this.spellcheckOptions) {
      params.spellcheck = true;
      Object.entries(this.spellcheckOptions).forEach(([key, value]) => {
        params[`spellcheck.${key}`] = value;
      });
    }

    // Add group parameters
    if (this.groupOptions) {
      params.group = true;
      Object.entries(this.groupOptions).forEach(([key, value]) => {
        params[`group.${key}`] = value;
      });
    }

    // Add stats parameters
    if (this.statsOptions.length > 0) {
      params.stats = true;
      this.statsOptions.forEach((options) => {
        params[`stats.field`] = [
          ...(params[`stats.field`] || []),
          options.field,
        ];
        if (options.facet) {
          params[`f.${options.field}.stats.facet`] = options.facet;
        }
        if (options.calcdistinct) {
          params[`f.${options.field}.stats.calcdistinct`] =
            options.calcdistinct;
        }
        if (options.percentiles) {
          params[`f.${options.field}.stats.percentiles`] =
            options.percentiles.join(',');
        }
        if (options.cardinality) {
          Object.entries(options.cardinality).forEach(
            ([cardKey, cardValue]) => {
              params[`f.${options.field}.stats.cardinality.${cardKey}`] =
                cardValue;
            },
          );
        }
      });
    }

    return params;
  }
}
