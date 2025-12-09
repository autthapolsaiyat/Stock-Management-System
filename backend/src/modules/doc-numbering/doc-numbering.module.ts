import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocSequenceEntity } from './entities/doc-sequence.entity';
import { DocNumberingService } from './doc-numbering.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocSequenceEntity])],
  providers: [DocNumberingService],
  exports: [DocNumberingService],
})
export class DocNumberingModule {}
