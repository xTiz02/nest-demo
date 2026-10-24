import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Panel visual interactivo de pruebas para probar todos los endpoints desde el navegador
   */
  @Get()
  @Header('Content-Type', 'text/html')
  getDashboard(): string {
    return this.appService.getDashboardHtml();
  }

  /**
   * Índice y resumen de rutas en formato JSON
   */
  @Get('api')
  getApiOverview() {
    return this.appService.getApiOverview();
  }
}
