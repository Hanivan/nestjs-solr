import { SolrModule } from '@libs/solr';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // SolrModule.register({
    //   host: 'localhost',
    //   port: 8983,
    //   cores: ['transaction_logs'],
    //   defaultCore: 'transaction_logs',
    // }),
    SolrModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const solrCores = configService.get('SOLR_CORES', 'test');
        const arrSolrCores = solrCores.split(',');
        const defaultCore = arrSolrCores?.[0];
        return {
          host: configService.get('SOLR_HOST', 'localhost'),
          port: configService.get('SOLR_PORT', 8983),
          cores: arrSolrCores,
          defaultCore,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
