import { Module } from '@nestjs/common';
import { ExamplesController } from './examples.controller.js';

@Module({
  controllers: [ExamplesController],
})
export class ExamplesModule {}
