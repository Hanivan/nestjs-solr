import { SolrService } from '@libs/solr';
import { IHighlightOptions } from '@libs/solr/interfaces/highlight.interface';
import { TSortField } from '@libs/solr/interfaces/sort.interface';
import { IStatsOptions } from '@libs/solr/interfaces/stats.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ITransactionLogSchema } from './interfaces/transaction-log.schema';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly solrService: SolrService<ITransactionLogSchema>,
  ) {}

  async addTrx() {
    const transactionLogsData: ITransactionLogSchema[] = Array.from(
      { length: 5 },
      (_, i) => {
        const id = (Math.random() * 100000).toFixed(0);
        const transactionId_s = `TRX-2024-00${id}`;
        const amount_f = parseFloat((Math.random() * 2000).toFixed(2));
        const statusOptions = ['COMPLETED', 'PENDING', 'FAILED'];
        const status_s =
          statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const createdAt_dt = new Date(
          Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
        );
        const userId_s = `USER${Math.floor(Math.random() * 1000)}`;
        const typeOptions = ['PAYMENT', 'WITHDRAWAL', 'DEPOSIT', 'TRANSFER'];
        const type_s =
          typeOptions[Math.floor(Math.random() * typeOptions.length)];
        const description_t = `${type_s} description for transaction ${transactionId_s}`;

        return {
          id,
          transactionId_s,
          amount_f,
          status_s,
          createdAt_dt,
          userId_s,
          type_s,
          description_t,
        };
      },
    );

    this.logger.verbose('Adding data...');
    await this.solrService.add(transactionLogsData);
    this.logger.verbose('Data added.');

    return { success: true, count: transactionLogsData.length };
  }

  async searchTransactions(userId: string) {
    const highlightOptions: IHighlightOptions = {
      fields: ['description_t'],
      snippets: 2,
      fragsize: 150,
      prefix: '<em>',
      postfix: '</em>',
    };

    const statsOptions: IStatsOptions = {
      field: 'amount_f',
      facet: ['type_s'],
      calcdistinct: true,
      percentiles: [50, 75, 90],
    };

    const sortOptions: TSortField<ITransactionLogSchema> = {
      createdAt_dt: 'desc',
      amount_f: 'desc',
    };

    return this.solrService
      .q({
        userId_s: userId,
        status_s: 'COMPLETED',
      })
      .matchFilter('type_s', 'PAYMENT')
      .fl(['transactionId_s', 'amount_f', 'createdAt_dt', 'description_t'])
      .highlight(highlightOptions)
      .stats(statsOptions)
      .sort(sortOptions)
      .start(0)
      .rows(10)
      .execute();
  }

  async getTransactionStats(fromDate: Date, toDate: Date) {
    return this.solrService
      .q({
        createdAt_dt: `[${fromDate.toISOString()} TO ${toDate.toISOString()}]`,
      })
      .bucket('low_value', 'amount_f:[* TO 1000]')
      .subBucket('high_value', 'amount_f:[1000 TO *]') // Nested bucket
      .termsFacet('types', 'type_s', {})
      .subBucket('low_value', 'amount_f:[* TO 1000]') // Another nested bucket
      .termsFacet('types', 'type_s', {})
      .build()
      .execute();
  }

  async searchAdvanced(params: {
    userId?: string;
    dateRange?: { from: Date; to: Date };
    amount?: { min?: number; max?: number };
    type?: string;
    status?: string;
    searchText?: string;
    page?: number;
    pageSize?: number;
  }) {
    const {
      userId,
      dateRange,
      amount,
      type,
      status,
      searchText,
      page = 0,
      pageSize = 10,
    } = params;

    const query: Partial<Record<keyof ITransactionLogSchema, any>> = {};

    // Build query conditionally
    if (userId) query.userId_s = userId;
    if (status) query.status_s = status;
    if (type) query.type_s = type;
    if (dateRange) {
      query.createdAt_dt = `[${dateRange.from.toISOString()} TO ${dateRange.to.toISOString()}]`;
    }
    if (amount?.min || amount?.max) {
      query.amount_f = `[${amount.min || '*'} TO ${amount.max || '*'}]`;
    }
    if (searchText) {
      query.description_t = `*${searchText}*`;
    }

    return this.solrService
      .q(query)
      .highlight({
        fields: ['description_t'],
        snippets: 2,
      })
      .sort({ createdAt_dt: 'desc' })
      .start(page * pageSize)
      .rows(pageSize)
      .stats({
        field: 'amount_f',
        calcdistinct: true,
        percentiles: [50, 90],
      })
      .bucket('summary', '*:*')
      .termsFacet('by_status', 'status_s', {
        facet: {
          type: 'terms',
          field: 'status_s',
          limit: 5,
        },
      })
      .termsFacet('by_type', 'type_s', {
        facet: {
          type: 'terms',
          field: 'type_s',
          limit: 5,
        },
      })
      .build()
      .execute();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
