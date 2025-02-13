import { Test, TestingModule } from '@nestjs/testing';

import { CBSError } from './error.service';
import { mockModules } from '../../../../testUtils/index';

describe('CBSError', () => {
  let service: CBSError;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CBSError, mockModules.mockLogger],
    }).compile();

    service = module.get<CBSError>(CBSError);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
