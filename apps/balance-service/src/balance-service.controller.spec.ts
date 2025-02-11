import { Test, TestingModule } from '@nestjs/testing';
import { BalanceServiceController } from './balance-service.controller';
import { BalanceDataService } from './balance-service.service';

describe('RateServiceController', () => {
  let balanceServiceController: BalanceServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceServiceController],
      providers: [BalanceDataService],
    }).compile();

    balanceServiceController = app.get<BalanceServiceController>(
      BalanceServiceController,
    );
  });

  describe('root', () => {
    it('should should be defined"', () => {
      expect(balanceServiceController).toBeDefined();
    });
  });
});
