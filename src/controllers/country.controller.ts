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
    @repository(StateRepository)
    public stateRepository: StateRepository,
    @repository(CityRepository)
    public cityRepository: CityRepository
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

  @get('/countries/search')
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
  async search(
    @param.filter(Country) filter?: Filter<Country>,
  ): Promise<City[]> {

    const countryData = await this.countryRepository.find(filter);
    const countryIds = countryData.map(counteryItem => counteryItem.countryId);

    let cityData: any[] = await this.cityRepository.find({
      limit: 300,
      where: {countryId: {inq: countryIds}}
    });
    let stateData = await this.stateRepository.find({
      where: {countryId: {inq: countryIds}},
      fields: ["id","name","stateId"]
    });

    cityData = cityData.map(cityItem => {
      cityItem.country = countryData.filter(countryItem => countryItem.countryId === cityItem.countryId)[0];
      cityItem.state = stateData.filter(stateItem => stateItem.stateId === cityItem.stateId)[0];
      return cityItem;
    });

    return cityData;
  }
}
