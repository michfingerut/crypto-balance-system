import { Test, TestingModule } from '@nestjs/testing';
import { RateServiceController } from './rate-service.controller';
import { RateService } from './rate-service.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('RateServiceController', () => {
  let rateServiceController: RateServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RateServiceController],
      providers: [
        RateService,
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    rateServiceController = app.get<RateServiceController>(
      RateServiceController,
    );
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(rateServiceController).toBeDefined();
    });
  });
});
