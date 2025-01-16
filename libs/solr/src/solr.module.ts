import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import {
  ISolrModuleAsyncOptions,
  ISolrModuleOptions,
} from './interfaces/base.interface';
import { SOLR_OPTIONS } from './solr.constants';
import { SolrService } from './solr.service';

@Module({
  imports: [HttpModule],
  providers: [SolrService],
  exports: [SolrService],
})
export class SolrModule {
  static register(options: ISolrModuleOptions): DynamicModule {
    return {
      module: SolrModule,
      providers: [
        {
          provide: SOLR_OPTIONS,
          useValue: options,
        },
        SolrService,
      ],
      exports: [SolrService],
    };
  }

  static registerAsync(options: ISolrModuleAsyncOptions): DynamicModule {
    return {
      module: SolrModule,
      imports: [HttpModule],
      providers: [
        {
          provide: SOLR_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        SolrService,
      ],
      exports: [SolrService],
    };
  }
}
