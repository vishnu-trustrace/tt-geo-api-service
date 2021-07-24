import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mongodb: {collection: 'countries'},
  },
})
export class Country extends Entity {
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
  countryId: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  iso3: string;

  @property({
    type: 'string',
    required: true,
  })
  iso2: string;

  @property({
    type: 'string',
  })
  phone_code?: string;

  @property({
    type: 'string',
  })
  capital?: string;

  @property({
    type: 'string',
  })
  currency?: string;

  @property({
    type: 'string',
  })
  native?: string;

  @property({
    type: 'string'
  })
  region: string;

  @property({
    type: 'string',
  })
  subregion?: string;

  @property({
    type: 'object',
  })
  translations?: object;

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

  @property({
    type: 'string',
  })
  emoji?: string;

  @property({
    type: 'string',
  })
  emojiU?: string;

  @property({
    type: 'object',
  })
  timezones?: object;

  constructor(data?: Partial<Country>) {
    super(data);
  }
}

export interface CountryRelations {
  // describe navigational properties here
}

export type CountryWithRelations = Country & CountryRelations;
