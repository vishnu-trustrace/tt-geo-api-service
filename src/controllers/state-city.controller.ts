import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  State,
  City,
} from '../models';
import {StateRepository} from '../repositories';

export class StateCityController {
  constructor(
    @repository(StateRepository) protected stateRepository: StateRepository,
  ) { }

  @get('/states/{id}/cities', {
    responses: {
      '200': {
        description: 'Array of State has many City',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<City>,
  ): Promise<City[]> {
    return this.stateRepository.cities(id).find(filter);
  }

  @post('/states/{id}/cities', {
    responses: {
      '200': {
        description: 'State model instance',
        content: {'application/json': {schema: getModelSchemaRef(City)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof State.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCityInState',
            exclude: ['id'],
            optional: ['stateObjId']
          }),
        },
      },
    }) city: Omit<City, 'id'>,
  ): Promise<City> {
    return this.stateRepository.cities(id).create(city);
  }

  @patch('/states/{id}/cities', {
    responses: {
      '200': {
        description: 'State.City PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: Partial<City>,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.stateRepository.cities(id).patch(city, where);
  }

  @del('/states/{id}/cities', {
    responses: {
      '200': {
        description: 'State.City DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(City)) where?: Where<City>,
  ): Promise<Count> {
    return this.stateRepository.cities(id).delete(where);
  }
}
