import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return dashboard HTML', () => {
      expect(appController.getDashboard()).toContain('NestJS Endpoint Lab');
    });

    it('should return API overview', () => {
      const overview = appController.getApiOverview();
      expect(overview).toHaveProperty('endpoints');
      expect(overview.endpoints).toHaveProperty('products');
    });
  });
});
