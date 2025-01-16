import { ModuleMetadata, Type } from '@nestjs/common';
import { SolrService } from '../solr.service';
import { ISolrFieldType, TSolrFieldSuffix } from './field.interface';

export interface ISolrModuleOptions {
  host: string;
  port: number;
  cores: string[];
  defaultCore?: string;
}

export interface ISolrModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SolrService>;
  useClass?: Type<SolrService>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ISolrModuleOptions> | ISolrModuleOptions;
  inject?: any[];
}

export interface ISolrDocument {
  id: string;
  [key: string]: any;
}

export interface ISolrSchema {
  [key: string]: ISolrFieldType[TSolrFieldSuffix];
}
