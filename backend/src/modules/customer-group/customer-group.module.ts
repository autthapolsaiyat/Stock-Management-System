import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerGroupController } from './customer-group.controller';
import { CustomerGroupService } from './customer-group.service';
import { CustomerGroupEntity } from './entities/customer-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerGroupEntity])],
  controllers: [CustomerGroupController],
  providers: [CustomerGroupService],
  exports: [CustomerGroupService],
})
export class CustomerGroupModule {}
