import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  City,
  State,
} from '../models';
import {CityRepository} from '../repositories';

export class CityStateController {
  constructor(
    @repository(CityRepository)
    public cityRepository: CityRepository,
  ) { }

  @get('/cities/{id}/state', {
    responses: {
      '200': {
        description: 'State belonging to City',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(State)},
          },
        },
      },
    },
  })
  async getState(
    @param.path.string('id') id: typeof City.prototype.id,
  ): Promise<State> {
    return this.cityRepository.state(id);
  }
}
