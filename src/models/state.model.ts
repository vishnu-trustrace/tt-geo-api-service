import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<State>) {
    super(data);
  }
}

export interface StateRelations {
  // describe navigational properties here
}

export type StateWithRelations = State & StateRelations;
