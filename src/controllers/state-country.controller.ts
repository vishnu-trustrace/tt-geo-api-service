import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  State,
  Country,
} from '../models';
import {StateRepository} from '../repositories';

export class StateCountryController {
  constructor(
    @repository(StateRepository)
    public stateRepository: StateRepository,
  ) { }

  @get('/states/{id}/country', {
    responses: {
      '200': {
        description: 'Country belonging to State',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Country)},
          },
        },
      },
    },
  })
  async getCountry(
    @param.path.string('id') id: typeof State.prototype.id,
  ): Promise<Country> {
    return this.stateRepository.country(id);
  }
}
