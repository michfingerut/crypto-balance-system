import { Test, TestingModule } from '@nestjs/testing';
import { CBSLogging } from './logging.controller';

describe('CBSLogging', () => {
  let controller: CBSLogging;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CBSLogging],
    }).compile();

    controller = module.get<CBSLogging>(CBSLogging);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
