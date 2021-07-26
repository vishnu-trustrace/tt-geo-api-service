import {Entity, model, property, belongsTo} from '@loopback/repository';
import {State} from './state.model';
import {Country} from './country.model';

@model({
  settings: {
    mongodb: {collection: 'cities'},
  },
})
export class City extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectId'},
    generated: true
  })
  id?: string;

  @property({
    type: 'number',
    generated: true
  })
  cityId: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  countryId: number;

  @property({
    type: 'number',
    required: true,
  })
  stateId: number;

  @property({
    type: 'string',
  })
  countryCode?: string;

  @property({
    type: 'string',
  })
  stateCode?: string;

  @property({
    type: 'string',
    required: true,
  })
  latitude: string;

  @property({
    type: 'string',
    required: true,
  })
  longitude: string;

  @belongsTo(() => State, {name: 'state'})
  stateObjId: string;

  @belongsTo(() => Country, {name: 'country'})
  countryObjId: string;

  constructor(data?: Partial<City>) {
    super(data);
  }
}

export interface CityRelations {
  // describe navigational properties here
}

export type CityWithRelations = City & CityRelations;
