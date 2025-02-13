import { Test, TestingModule } from '@nestjs/testing';

import { CBSFileOpService } from './file-op.service';

interface TestData {
  key: string;
  value: string;
}

describe('CBSFileOpService', () => {
  let service: CBSFileOpService<TestData>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CBSFileOpService],
    }).compile();

    service = module.get<CBSFileOpService<TestData>>(CBSFileOpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
