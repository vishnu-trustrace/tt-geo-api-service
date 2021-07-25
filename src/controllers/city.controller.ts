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

export class CityController {
  constructor(
    @repository(CityRepository)
    public cityRepository : CityRepository,
  ) {}

  @post('/cities')
  @response(200, {
    description: 'City model instance',
    content: {'application/json': {schema: getModelSchemaRef(City)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {
            title: 'NewCity',
            //exclude: ['id'],
          }),
        },
      },
    })
    city: City,
  ): Promise<City> {
    let lastCityObj = await this.cityRepository.find({
      limit: 1,
      order: ["cityId DESC"]
    });

    city.cityId = lastCityObj.length ? lastCityObj[0].cityId + 1 : 1;

    return this.cityRepository.create(city);
  }

  @get('/cities/count')
  @response(200, {
    description: 'City model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(City) where?: Where<City>,
  ): Promise<Count> {
    return this.cityRepository.count(where);
  }

  @get('/cities')
  @response(200, {
    description: 'Array of City model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(City, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(City) filter?: Filter<City>,
  ): Promise<City[]> {
    return this.cityRepository.find(filter);
  }

  @patch('/cities')
  @response(200, {
    description: 'City PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
    @param.where(City) where?: Where<City>,
  ): Promise<Count> {
    return this.cityRepository.updateAll(city, where);
  }

  @get('/cities/{id}')
  @response(200, {
    description: 'City model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(City, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(City, {exclude: 'where'}) filter?: FilterExcludingWhere<City>
  ): Promise<City> {
    return this.cityRepository.findById(id, filter);
  }

  @patch('/cities/{id}')
  @response(204, {
    description: 'City PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(City, {partial: true}),
        },
      },
    })
    city: City,
  ): Promise<void> {
    await this.cityRepository.updateById(id, city);
  }

  @put('/cities/{id}')
  @response(204, {
    description: 'City PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() city: City,
  ): Promise<void> {
    await this.cityRepository.replaceById(id, city);
  }

  @del('/cities/{id}')
  @response(204, {
    description: 'City DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cityRepository.deleteById(id);
  }

  @get('/city/{id}/country')
  @response(200, {
    description: 'Country mapped to the city',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Country, {includeRelations: true}),
      },
    },
  })
  async getCountry(
    @param.path.string('id') id: string,
    @param.filter(Country) filter: Filter<Country>
  ): Promise<Country[]> {
    let cityObj = await this.cityRepository.findById(id);
    let countryRepo: CountryRepository = new CountryRepository(
      new MongodbDataSource()
    );

    filter.where = Object.assign({},filter.where,{countryId: cityObj.countryId});

    return countryRepo.find(filter);
  }

  @get('/city/{id}/state')
  @response(200, {
    description: 'State mapped to the city',
    content: {
      'application/json': {
        schema: getModelSchemaRef(State, {includeRelations: true}),
      },
    },
  })
  async getState(
    @param.path.string('id') id: string,
    @param.filter(State) filter: Filter<State>
  ): Promise<State[]> {
    let cityObj = await this.cityRepository.findById(id);
    let stateRepo: StateRepository = new StateRepository(
      new MongodbDataSource()
    );

    filter.where = Object.assign({},filter.where,{stateId: cityObj.stateId});

    return stateRepo.find(filter);
  }

  @get('/cities/search')
  @response(200, {
    description: 'Array of City model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(City, {includeRelations: true}),
        },
      },
    },
  })
  async searchCity(
    @param.filter(City) filter?: Filter<City>
  ): Promise<City[]> {

    let countryRepo: CountryRepository = new CountryRepository(
      new MongodbDataSource()
    );

    let stateRepo: StateRepository = new StateRepository(
      new MongodbDataSource()
    );
    
    let cityData = await this.cityRepository.find(filter);
    
    let countryIds = cityData.map((item: any) => item.countryId)
    countryIds = [...new Set(countryIds)];

    let stateIds = cityData.map((item: any) => item.stateId)
    stateIds = [...new Set(stateIds)];

    let countryData = await countryRepo.find({
      where: {countryId: {inq: countryIds} },
      fields: ["id","name","iso2","countryId"]
    });

    let stateData = await stateRepo.find({
      where: {stateId: {inq: stateIds} },
      fields: ["id", "name", "stateCode","stateId"]
    });

    cityData = cityData.map((item: any) => {
      item.country = countryData.filter(countryItem => countryItem.countryId === item.countryId)[0];
      item.state   = stateData.filter(stateItem => stateItem.stateId === item.stateId)[0];
      return item;
    });

    return cityData;
    
  }
}
