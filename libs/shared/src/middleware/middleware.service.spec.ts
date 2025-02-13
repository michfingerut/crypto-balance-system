import { Test, TestingModule } from '@nestjs/testing';

import { ValidateUserIdMiddleware } from './middleware.service';
import { mockModules } from '../../../../testUtils/index';

describe('ValidateUserIdMiddleware', () => {
  let service: ValidateUserIdMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateUserIdMiddleware, mockModules.mockLogger],
    }).compile();

    service = module.get<ValidateUserIdMiddleware>(ValidateUserIdMiddleware);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
