import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {State, StateRelations, Country, City} from '../models';
import {CountryRepository} from './country.repository';
import {CityRepository} from './city.repository';

export class StateRepository extends DefaultCrudRepository<
  State,
  typeof State.prototype.id,
  StateRelations
> {

  public readonly country: BelongsToAccessor<Country, typeof State.prototype.id>;

  public readonly cities: HasManyRepositoryFactory<City, typeof State.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>,
  ) {
    super(State, dataSource);
    this.cities = this.createHasManyRepositoryFactoryFor('cities', cityRepositoryGetter,);
    this.registerInclusionResolver('cities', this.cities.inclusionResolver);
    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter,);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
