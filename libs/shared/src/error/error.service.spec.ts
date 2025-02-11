import { Test, TestingModule } from '@nestjs/testing';
import { CBSError } from './error.service';
import { CBSLogging } from '../logging/logging.service';

describe('CBSError', () => {
  let service: CBSError;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CBSError,
        {
          provide: CBSLogging,
          useValue: { log: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CBSError>(CBSError);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
