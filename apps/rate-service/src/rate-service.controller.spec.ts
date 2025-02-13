import { Test, TestingModule } from '@nestjs/testing';

import { RateServiceController } from './rate-service.controller';
import { RateService } from './rate-service.service';
import { mockModules } from '../../../testUtils/index';

describe('RateServiceController', () => {
  let rateServiceController: RateServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RateServiceController],
      providers: [
        RateService,
        mockModules.mockCacheManager,
        mockModules.mockLogger,
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
