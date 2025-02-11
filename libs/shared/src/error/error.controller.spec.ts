import { Test, TestingModule } from '@nestjs/testing';
import { CBSError } from './error.controller';

describe('CBSError', () => {
  let controller: CBSError;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CBSError],
    }).compile();

    controller = module.get<CBSError>(CBSError);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
