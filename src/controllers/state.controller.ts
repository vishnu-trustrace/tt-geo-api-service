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

  @get('/state/{id}/country')
  @response(200, {
    description: 'Country mapped to state',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Country, {includeRelations: true}),
      },
    },
  })
  async getCountryByStateId(
    @param.path.string('id') id: string,
    @param.filter(Country) filter: Filter<Country>
  ): Promise<Country[]> {
    let stateObj = await this.stateRepository.findById(id);
    let countryRepo: CountryRepository = new CountryRepository(
      new MongodbDataSource()
    );

    filter.where = Object.assign({},filter.where,{countryId: stateObj.countryId});

    return countryRepo.find(filter);
  }

  @get('/state/{id}/cities')
  @response(200, {
    description: 'Array of state has many cities',
    content: {
      'application/json': {
        schema: getModelSchemaRef(City, {includeRelations: true}),
      },
    },
  })
  async getCitiesByStateId(
    @param.path.string('id') id: string,
    @param.filter(City) filter: Filter<City>
  ): Promise<City[]> {
    let stateObj = await this.stateRepository.findById(id);
    let cityRepo: CityRepository = new CityRepository(
      new MongodbDataSource()
    );

    filter.where = Object.assign({},filter.where,{stateId: stateObj.stateId});

    return cityRepo.find(filter);
  }

  @get('/states/search')
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
  async searchState(
    @param.filter(State) filter?: Filter<State>,
  ): Promise<City[]> {

    let stateData = await this.stateRepository.find(filter);
    let stateIds = stateData.map(stateItem => stateItem.stateId);

    let countryRepo: CountryRepository = new CountryRepository(
      new MongodbDataSource()
    );
    let cityRepo: CityRepository = new CityRepository(
      new MongodbDataSource()
    );

    let countryIds = stateData.map(stateItem => stateItem.countryId);
    countryIds = [...new Set(countryIds)];

    let countryData = await countryRepo.find({
      fields: ["id","name", "countryId"],
      where: {countryId: {inq: countryIds}}
    });

    let cityData = await cityRepo.find({
      limit: 200,
      where: {stateId: {inq: stateIds}}
    });
    
    cityData = cityData.map(cityItem => {
      let stateItem = [...stateData.filter(stateItem => stateItem.stateId === cityItem.stateId)][0];
      let countryItem = [...new Set(countryData.filter(countryItem => countryItem.countryId === cityItem.countryId))][0];
      cityItem.state = stateItem;
      cityItem.country = countryItem;
      return cityItem;
    });

    return cityData;
  }
}
