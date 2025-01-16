import { Test, TestingModule } from '@nestjs/testing';
import { SolrService } from './solr.service';

describe('SolrService', () => {
  let service: SolrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolrService],
    }).compile();

    service = module.get<SolrService>(SolrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
