import { Test, TestingModule } from '@nestjs/testing';
import { ValidateUserIdMiddleware } from './middleware.service';

describe('MiddlewareController', () => {
  let controller: ValidateUserIdMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateUserIdMiddleware],
    }).compile();

    controller = module.get<ValidateUserIdMiddleware>(ValidateUserIdMiddleware);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
