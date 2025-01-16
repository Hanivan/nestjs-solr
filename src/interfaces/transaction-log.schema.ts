import { ISolrSchema } from '@libs/solr/interfaces/base.interface';

export interface ITransactionLogSchema extends ISolrSchema {
  id: string;
  transactionId_s: string;
  amount_f: number;
  status_s: string;
  createdAt_dt: Date | string;
  userId_s: string;
  type_s: string;
  description_t: string;
}
