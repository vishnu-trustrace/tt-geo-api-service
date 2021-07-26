import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {City, CityRelations, State, Country} from '../models';
import {StateRepository} from './state.repository';
import {CountryRepository} from './country.repository';

export class CityRepository extends DefaultCrudRepository<
  City,
  typeof City.prototype.id,
  CityRelations
> {

  public readonly state: BelongsToAccessor<State, typeof City.prototype.id>;

  public readonly country: BelongsToAccessor<Country, typeof City.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('StateRepository') protected stateRepositoryGetter: Getter<StateRepository>, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>,
  ) {
    super(City, dataSource);
    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter,);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
    this.state = this.createBelongsToAccessorFor('state', stateRepositoryGetter,);
    this.registerInclusionResolver('state', this.state.inclusionResolver);
  }
}
