import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {SubRegion} from '../models';
import {SubRegionRepository} from '../repositories';

export class SubRegionController {
  constructor(
    @repository(SubRegionRepository)
    public subRegionRepository : SubRegionRepository,
  ) {}

  @post('/sub-regions')
  @response(200, {
    description: 'SubRegion model instance',
    content: {'application/json': {schema: getModelSchemaRef(SubRegion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubRegion, {
            title: 'NewSubRegion',
            exclude: ['id'],
          }),
        },
      },
    })
    subRegion: Omit<SubRegion, 'id'>,
  ): Promise<SubRegion> {
    return this.subRegionRepository.create(subRegion);
  }

  @get('/sub-regions/count')
  @response(200, {
    description: 'SubRegion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SubRegion) where?: Where<SubRegion>,
  ): Promise<Count> {
    return this.subRegionRepository.count(where);
  }

  @get('/sub-regions')
  @response(200, {
    description: 'Array of SubRegion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SubRegion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SubRegion) filter?: Filter<SubRegion>,
  ): Promise<SubRegion[]> {
    return this.subRegionRepository.find(filter);
  }

  @patch('/sub-regions')
  @response(200, {
    description: 'SubRegion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubRegion, {partial: true}),
        },
      },
    })
    subRegion: SubRegion,
    @param.where(SubRegion) where?: Where<SubRegion>,
  ): Promise<Count> {
    return this.subRegionRepository.updateAll(subRegion, where);
  }

  @get('/sub-regions/{id}')
  @response(200, {
    description: 'SubRegion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SubRegion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(SubRegion, {exclude: 'where'}) filter?: FilterExcludingWhere<SubRegion>
  ): Promise<SubRegion> {
    return this.subRegionRepository.findById(id, filter);
  }

  @patch('/sub-regions/{id}')
  @response(204, {
    description: 'SubRegion PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SubRegion, {partial: true}),
        },
      },
    })
    subRegion: SubRegion,
  ): Promise<void> {
    await this.subRegionRepository.updateById(id, subRegion);
  }

  @put('/sub-regions/{id}')
  @response(204, {
    description: 'SubRegion PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subRegion: SubRegion,
  ): Promise<void> {
    await this.subRegionRepository.replaceById(id, subRegion);
  }

  @del('/sub-regions/{id}')
  @response(204, {
    description: 'SubRegion DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subRegionRepository.deleteById(id);
  }
}
