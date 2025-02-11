import { Test, TestingModule } from '@nestjs/testing';
import { CBSLogging } from './logging.service';

describe('CBSLogging', () => {
  let service: CBSLogging;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CBSLogging],
    }).compile();

    service = module.get<CBSLogging>(CBSLogging);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
