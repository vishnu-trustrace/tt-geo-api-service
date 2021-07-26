import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Country} from './country.model';
import {City} from './city.model';

@model({
  settings: {
    mongodb: {collection: 'states'},
  },
})
export class State extends Entity {
  @property({
    type: 'string',
    id: true,
    mongodb: {dataType: 'ObjectId'},
    generated: true
  })
  id: string;

  @property({
    type: 'number',
    generated: true
  })
  stateId: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  stateCode?: string;

  @property({
    type: 'number',
    required: true,
  })
  countryId: number;

  @property({
    type: 'string',
  })
  countryCode?: string;

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

  @belongsTo(() => Country, {name: 'country'})
  countryObjId: string;

  @hasMany(() => City, {keyTo: 'stateObjId'})
  cities: City[];

  constructor(data?: Partial<State>) {
    super(data);
  }
}

export interface StateRelations {
  // describe navigational properties here
}

export type StateWithRelations = State & StateRelations;
