import { CBSLogging } from '@app/shared/logging/logging.service';
import { CBSFileOpService } from '@app/shared/file-op/file-op.service'; // Assuming this is the path for CBSFileOpService

const mockModules = {
  mockLogger: {
    provide: CBSLogging,
    useValue: {
      log: jest.fn(),
      error: jest.fn(),
      setContext: jest.fn(),
    },
  },
  mockCacheManager: {
    provide: 'CACHE_MANAGER',
    useValue: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
  mockFileOp: {
    provide: CBSFileOpService,
    useValue: {
      readDataFromFile: jest.fn(),
      writeDataToFile: jest.fn(),
    },
  },
};

export { mockModules };
