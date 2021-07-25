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
  getFieldsJsonSchemaFor,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {MongodbDataSource} from '../datasources';
import {City, Country, State} from '../models';
import {CityRepository, CountryRepository, StateRepository} from '../repositories';

export class CountryController {
  constructor(
    @repository(CountryRepository)
    public countryRepository : CountryRepository,
  ) {}

  @post('/countries')
  @response(200, {
    description: 'Country model instance',
    content: {'application/json': {schema: getModelSchemaRef(Country)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {
            title: 'NewCountry',
            //exclude: ['countryId'],
          }),
        },
      },
    })
    country: Country
  ): Promise<Country> {

    let lastCountryObj = await this.countryRepository.find({
      limit: 1,
      order: ["countryId DESC"]
    });

    country.countryId = lastCountryObj.length ? lastCountryObj[0].countryId + 1 : 1;

    return this.countryRepository.create(country);
  }

  @get('/countries/count')
  @response(200, {
    description: 'Country model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Country) where?: Where<Country>,
  ): Promise<Count> {
    return this.countryRepository.count(where);
  }

  @get('/countries')
  @response(200, {
    description: 'Array of Country model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Country, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Country) filter?: Filter<Country>,
  ): Promise<Country[]> {
    return this.countryRepository.find(filter);
  }

  @patch('/countries')
  @response(200, {
    description: 'Country PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {partial: true}),
        },
      },
    })
    country: Country,
    @param.where(Country) where?: Where<Country>,
  ): Promise<Count> {
    return this.countryRepository.updateAll(country, where);
  }

  @get('/countries/{id}')
  @response(200, {
    description: 'Country model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Country, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Country, {exclude: 'where'}) filter?: FilterExcludingWhere<Country>
  ): Promise<Country> {
    return this.countryRepository.findById(id, filter);
  }

  @patch('/countries/{id}')
  @response(204, {
    description: 'Country PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Country, {partial: true}),
        },
      },
    })
    country: Country,
  ): Promise<void> {
    await this.countryRepository.updateById(id, country);
  }

  @put('/countries/{id}')
  @response(204, {
    description: 'Country PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() country: Country,
  ): Promise<void> {
    await this.countryRepository.replaceById(id, country);
  }

  @del('/countries/{id}')
  @response(204, {
    description: 'Country DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.countryRepository.deleteById(id);
  }

  @get('/country/{id}/states', {
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
  async getStateByCountryId(
    @param.path.string('id') id: string,
    @param.filter(State) filter: Filter<State>
  ): Promise<State[]> {
    let countryObj = await this.countryRepository.findById(id);

    let stateRepo: StateRepository = new StateRepository(
      new MongodbDataSource()
    );

    filter.where = Object.assign({},filter.where,{countryId: countryObj.countryId});

    return stateRepo.find(filter);
  }

  @get('/country/{id}/cities', {
    responses: {
      '200': {
        description: 'Array of country has many cities',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(City)},
          },
        },
      },
    },
  })
  async getCityByCountryId(
    @param.path.string('id') id: string,
    @param.filter(City) filter: Filter<City>
  ): Promise<City[]> {
    let countryObj = await this.countryRepository.findById(id);

    let cityRepo: CityRepository = new CityRepository(
      new MongodbDataSource()
    );

    filter.where = Object.assign({},filter.where,{countryId: countryObj.countryId});

    return cityRepo.find(filter);
  }

  @get('/country/search')
  @response(200, {
    description: 'Array of Country model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Country, {includeRelations: true}),
        },
      },
    },
  })
  async countrySearch(
    @param.filter(Country) filter?: Filter<Country>,
  ): Promise<City[]> {

    let cityRepo: CityRepository = new CityRepository(
      new MongodbDataSource()
    );
    let stateRepo: StateRepository = new StateRepository(
      new MongodbDataSource()
    );

    let countryData = await this.countryRepository.find(filter);
    let countryIds = countryData.map(countryItem => countryItem.countryId);
      
    let stateData = await stateRepo.find({
      fields: ["id","name","stateId","countryId"],
      where: {countryId: {inq: countryIds}}
    });
    let cityData = await cityRepo.find({
      limit: 200,
      where: {countryId: {inq: countryIds}}
    });

    cityData = cityData.map(cityItem => {
      cityItem.state = [...stateData.filter(stateItem => stateItem.stateId === cityItem.stateId)][0];
      cityItem.country = [...countryData.filter(countryItem => countryItem.countryId === cityItem.countryId)][0]
      return cityItem
    })

    return cityData;
  }
}
