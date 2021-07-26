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
  Country,
  State,
} from '../models';
import {CountryRepository} from '../repositories';

export class CountryStateController {
  constructor(
    @repository(CountryRepository) protected countryRepository: CountryRepository,
  ) { }

  @get('/countries/{id}/states', {
    responses: {
      '200': {
        description: 'Array of Country has many State',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(State)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<State>,
  ): Promise<State[]> {
    return this.countryRepository.states(id).find(filter);
  }

  @post('/countries/{id}/states', {
    responses: {
      '200': {
        description: 'Country model instance',
        content: {'application/json': {schema: getModelSchemaRef(State)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Country.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(State, {
            title: 'NewStateInCountry',
            exclude: ['id'],
            optional: ['countryObjId']
          }),
        },
      },
    }) state: Omit<State, 'id'>,
  ): Promise<State> {
    return this.countryRepository.states(id).create(state);
  }

  @patch('/countries/{id}/states', {
    responses: {
      '200': {
        description: 'Country.State PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(State, {partial: true}),
        },
      },
    })
    state: Partial<State>,
    @param.query.object('where', getWhereSchemaFor(State)) where?: Where<State>,
  ): Promise<Count> {
    return this.countryRepository.states(id).patch(state, where);
  }

  @del('/countries/{id}/states', {
    responses: {
      '200': {
        description: 'Country.State DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(State)) where?: Where<State>,
  ): Promise<Count> {
    return this.countryRepository.states(id).delete(where);
  }
}
