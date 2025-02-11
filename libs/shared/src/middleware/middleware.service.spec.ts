import { Test, TestingModule } from '@nestjs/testing';

import { ValidateUserIdMiddleware } from './middleware.service';
describe('ValidateUserIdMiddleware', () => {
  let service: ValidateUserIdMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateUserIdMiddleware],
    }).compile();

    service = module.get<ValidateUserIdMiddleware>(ValidateUserIdMiddleware);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
