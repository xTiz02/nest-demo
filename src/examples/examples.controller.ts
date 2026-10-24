import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Headers,
  Ip,
  HttpCode,
  HttpStatus,
  Header,
  Redirect,
  ParseBoolPipe,
  ParseArrayPipe,
  DefaultValuePipe,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('examples')
export class ExamplesController {
  /**
   * 1. INSPECCIÓN DE CABECERAS Y METADATOS DE LA PETICIÓN
   * GET /examples/inspect-request
   * Extrae la IP del cliente, User-Agent, Authorization y todas las cabeceras HTTP.
   */
  @Get('inspect-request')
  inspectRequest(
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Headers('authorization') authHeader: string,
    @Headers() allHeaders: Record<string, string>,
  ) {
    return {
      message: 'Inspección de metadatos de la petición HTTP',
      clientIp: ip,
      userAgent: userAgent || 'No enviado',
      authorization: authHeader || 'No presente',
      totalHeaders: Object.keys(allHeaders).length,
      sampleHeaders: {
        host: allHeaders['host'],
        accept: allHeaders['accept'],
        'content-type': allHeaders['content-type'],
      },
    };
  }

  /**
   * 2. CABECERAS PERSONALIZADAS DE RESPUESTA
   * GET /examples/custom-headers
   * Demuestra el uso del decorador @Header() para emitir cabeceras HTTP en la respuesta.
   */
  @Get('custom-headers')
  @Header('X-Powered-By-NestJS', 'NestJS v12 Core')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  @Header('X-Demo-Timestamp', new Date().toISOString())
  customHeaders() {
    return {
      message: 'Revisa las cabeceras de respuesta (Response Headers) en la pestaña Network / Inspección',
      headersSent: [
        'X-Powered-By-NestJS: NestJS v12 Core',
        'Cache-Control: no-store, no-cache, must-revalidate',
        'X-Demo-Timestamp',
      ],
    };
  }

  /**
   * 3. PIPES NATIVOS DE TRANSFORMACIÓN
   * GET /examples/pipes-showcase?active=true&tags=nest,js,api&page=3
   * Demuestra: ParseBoolPipe, ParseArrayPipe y DefaultValuePipe.
   */
  @Get('pipes-showcase')
  pipesShowcase(
    @Query('active', new DefaultValuePipe(false), ParseBoolPipe) active: boolean,
    @Query('tags', new DefaultValuePipe([]), new ParseArrayPipe({ items: String, separator: ',' }))
    tags: string[],
    @Query('page', new DefaultValuePipe(1)) page: number,
  ) {
    return {
      message: 'Parámetros transformados y validados con Pipes nativos de NestJS',
      types: {
        active: { value: active, type: typeof active },
        tags: { value: tags, isArray: Array.isArray(tags), count: tags.length },
        page: { value: page, type: typeof page },
      },
    };
  }

  /**
   * 4. CÓDIGO DE ESTADO PERSONALIZADO
   * POST /examples/custom-status
   * Demuestra @HttpCode(HttpStatus.ACCEPTED) -> 202 Accepted.
   */
  @Post('custom-status')
  @HttpCode(HttpStatus.ACCEPTED)
  customStatus() {
    return {
      statusCode: HttpStatus.ACCEPTED,
      statusName: '202 ACCEPTED',
      message: 'Petición recibida y en cola para procesamiento asíncrono',
    };
  }

  /**
   * 5. REDIRECCIÓN ESTÁTICA Y DINÁMICA
   * GET /examples/redirect-demo?docs=true
   * Demuestra el uso de @Redirect().
   */
  @Get('redirect-demo')
  @Redirect('https://nestjs.com', HttpStatus.MOVED_PERMANENTLY)
  redirectDemo(@Query('docs') docs?: string) {
    if (docs === 'true') {
      return {
        url: 'https://docs.nestjs.com/controllers#redirection',
        statusCode: HttpStatus.FOUND,
      };
    }
    // Si no retorna nada, usa los valores por defecto del decorador
  }

  /**
   * 6. ACCESO DIRECTO A OBJETOS EXPRESS (REQ / RES)
   * GET /examples/express-interop
   * Demuestra cómo acceder al objeto Response sin perder la serialización automática de NestJS
   * usando @Res({ passthrough: true }).
   */
  @Get('express-interop')
  expressInterop(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('nest_demo_cookie', 'nest_session_active_123', {
      httpOnly: true,
      maxAge: 3600000,
    });
    res.header('X-Express-Interop', 'Enabled');

    return {
      message: 'Cookie establecida y cabecera añadida usando el objeto Express Response nativo con { passthrough: true }',
      method: req.method,
      protocol: req.protocol,
      originalUrl: req.originalUrl,
    };
  }
}
