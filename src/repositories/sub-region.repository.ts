import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {SubRegion, SubRegionRelations} from '../models';

export class SubRegionRepository extends DefaultCrudRepository<
  SubRegion,
  typeof SubRegion.prototype.id,
  SubRegionRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(SubRegion, dataSource);
  }
}
