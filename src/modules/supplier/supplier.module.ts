import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity, SupplierContactEntity } from './entities';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity, SupplierContactEntity])],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
