import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
  StreamableFile,
  Res,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import type { Response } from 'express';
import { FilesService } from './files.service.js';

// Configuración de almacenamiento en disco con nombres únicos sanitizados
const multerDiskStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const safeBaseName = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    callback(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
  },
});

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * 1. SUBIDA DE UN SOLO ARCHIVO (Single File Upload)
   * POST /files/upload-single
   * Utiliza FileInterceptor('file').
   * Demuestra ParseFilePipeBuilder para validar tamaño máximo (10 MB).
   */
  @Post('upload-single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerDiskStorage,
    }),
  )
  uploadSingleFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10 MB
          message: 'El archivo supera el tamaño máximo permitido de 10MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.processSingleFile(file);
  }

  /**
   * 2. SUBIDA DE MÚLTIPLES ARCHIVOS (Array of Files)
   * POST /files/upload-multiple
   * Utiliza FilesInterceptor('files', maxCount).
   * Permite subir hasta 5 archivos bajo la clave 'files'.
   */
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: multerDiskStorage,
    }),
  )
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.processMultipleFiles(files);
  }

  /**
   * 3. SUBIDA MULTIPART CON CAMPOS MIXTOS (Fields + Files)
   * POST /files/upload-fields
   * Permite recibir múltiples archivos con nombres de campo distintos (ej: avatar y documents)
   * junto con campos de texto regulares en el cuerpo (@Body).
   */
  @Post('upload-fields')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'documents', maxCount: 3 },
      ],
      {
        storage: multerDiskStorage,
      },
    ),
  )
  uploadMixedFields(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
    @Body() body: Record<string, any>,
  ) {
    return this.filesService.processMixedFields(files, body);
  }

  /**
   * 4. LISTADO DE ARCHIVOS GUARDADOS
   * GET /files/list
   */
  @Get('list')
  listFiles() {
    return {
      total: this.filesService.listFiles().length,
      files: this.filesService.listFiles(),
    };
  }

  /**
   * 5. DESCARGA Y STREAMING DE ARCHIVOS (StreamableFile)
   * GET /files/download/:filename
   * Permite descargar un archivo almacenado como stream con cabeceras HTTP adecuadas.
   */
  @Get('download/:filename')
  downloadFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const fileInfo = this.filesService.getFileStream(filename);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
      'Content-Length': fileInfo.size.toString(),
    });

    return new StreamableFile(fileInfo.stream);
  }
}
