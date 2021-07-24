import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mongodb: {collection: 'subregions'},
  },
})
export class SubRegion extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectId'}
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  constructor(data?: Partial<SubRegion>) {
    super(data);
  }
}

export interface SubRegionRelations {
  // describe navigational properties here
}

export type SubRegionWithRelations = SubRegion & SubRegionRelations;
