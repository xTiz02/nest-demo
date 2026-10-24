import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { existsSync, mkdirSync, createReadStream, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

@Injectable()
export class FilesService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  processSingleFile(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    return {
      message: 'Archivo subido con éxito',
      fileDetails: {
        originalName: file.originalname,
        savedAs: file.filename,
        mimetype: file.mimetype,
        sizeInBytes: file.size,
        sizeInKb: (file.size / 1024).toFixed(2) + ' KB',
        path: file.path,
      },
    };
  }

  processMultipleFiles(files?: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se subió ningún archivo');
    }

    return {
      message: `Se subieron ${files.length} archivos con éxito`,
      files: files.map((file) => ({
        originalName: file.originalname,
        savedAs: file.filename,
        mimetype: file.mimetype,
        sizeInKb: (file.size / 1024).toFixed(2) + ' KB',
      })),
    };
  }

  processMixedFields(
    files: {
      avatar?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
    metadata: Record<string, any>,
  ) {
    return {
      message: 'Datos y archivos multipart procesados correctamente',
      metadata,
      avatar: files.avatar?.[0]
        ? {
            originalName: files.avatar[0].originalname,
            savedAs: files.avatar[0].filename,
            sizeInKb: (files.avatar[0].size / 1024).toFixed(2) + ' KB',
          }
        : null,
      documents: (files.documents || []).map((doc) => ({
        originalName: doc.originalname,
        savedAs: doc.filename,
        sizeInKb: (doc.size / 1024).toFixed(2) + ' KB',
      })),
    };
  }

  getFileStream(filename: string) {
    // Sanitizar filename para prevenir Path Traversal
    const safeFilename = filename.replace(/(\.\.[\/\\])+/g, '');
    const filePath = join(this.uploadDir, safeFilename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`El archivo "${safeFilename}" no existe en el servidor`);
    }

    const stats = statSync(filePath);
    const stream = createReadStream(filePath);

    return {
      stream,
      size: stats.size,
      filename: safeFilename,
    };
  }

  listFiles() {
    if (!existsSync(this.uploadDir)) {
      return [];
    }

    const filenames = readdirSync(this.uploadDir);
    return filenames.map((name) => {
      const stats = statSync(join(this.uploadDir, name));
      return {
        filename: name,
        sizeInKb: (stats.size / 1024).toFixed(2) + ' KB',
        createdAt: stats.birthtime,
      };
    });
  }
}
