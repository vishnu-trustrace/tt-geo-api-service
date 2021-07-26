import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {MongodbDataSource} from '../datasources';
import {City, Country, State} from '../models';
import {CityRepository, CountryRepository, StateRepository} from '../repositories';

export class StateController {
  constructor(
    @repository(StateRepository)
    public stateRepository : StateRepository,
  ) {}

  @post('/states')
  @response(200, {
    description: 'State model instance',
    content: {'application/json': {schema: getModelSchemaRef(State)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(State, {
            title: 'NewState'
          }),
        },
      },
    })
    state: State,
  ): Promise<State> {
    let lastStateObj = await this.stateRepository.find({
      limit: 1,
      order: ["stateId DESC"]
    });

    state.stateId = lastStateObj.length ? lastStateObj[0].stateId + 1 : 1;

    return this.stateRepository.create(state);
  }

  @get('/states/count')
  @response(200, {
    description: 'State model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(State) where?: Where<State>,
  ): Promise<Count> {
    return this.stateRepository.count(where);
  }

  @get('/states')
  @response(200, {
    description: 'Array of State model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(State, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(State) filter?: Filter<State>,
  ): Promise<State[]> {
    return this.stateRepository.find(filter);
  }

  @patch('/states')
  @response(200, {
    description: 'State PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(State, {partial: true}),
        },
      },
    })
    state: State,
    @param.where(State) where?: Where<State>,
  ): Promise<Count> {
    return this.stateRepository.updateAll(state, where);
  }

  @get('/states/{id}')
  @response(200, {
    description: 'State model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(State, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(State, {exclude: 'where'}) filter?: FilterExcludingWhere<State>
  ): Promise<State> {
    return this.stateRepository.findById(id, filter);
  }

  @patch('/states/{id}')
  @response(204, {
    description: 'State PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(State, {partial: true}),
        },
      },
    })
    state: State,
  ): Promise<void> {
    await this.stateRepository.updateById(id, state);
  }

  @put('/states/{id}')
  @response(204, {
    description: 'State PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() state: State,
  ): Promise<void> {
    await this.stateRepository.replaceById(id, state);
  }

  @del('/states/{id}')
  @response(204, {
    description: 'State DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.stateRepository.deleteById(id);
  }
}
