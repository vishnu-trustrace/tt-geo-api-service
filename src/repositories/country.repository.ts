import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Country, CountryRelations, State, City} from '../models';
import {StateRepository} from './state.repository';
import {CityRepository} from './city.repository';

export class CountryRepository extends DefaultCrudRepository<
  Country,
  typeof Country.prototype.id,
  CountryRelations
> {

  public readonly states: HasManyRepositoryFactory<State, typeof Country.prototype.id>;

  public readonly cities: HasManyRepositoryFactory<City, typeof Country.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('StateRepository') protected stateRepositoryGetter: Getter<StateRepository>, @repository.getter('CityRepository') protected cityRepositoryGetter: Getter<CityRepository>,
  ) {
    super(Country, dataSource);
    this.cities = this.createHasManyRepositoryFactoryFor('cities', cityRepositoryGetter,);
    this.registerInclusionResolver('cities', this.cities.inclusionResolver);
    this.states = this.createHasManyRepositoryFactoryFor('states', stateRepositoryGetter,);
    this.registerInclusionResolver('states', this.states.inclusionResolver);

  }
}
