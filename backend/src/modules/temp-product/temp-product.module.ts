import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempProductEntity } from './entities';
import { TempProductService } from './temp-product.service';
import { TempProductController } from './temp-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TempProductEntity])],
  controllers: [TempProductController],
  providers: [TempProductService],
  exports: [TempProductService],
})
export class TempProductModule {}
