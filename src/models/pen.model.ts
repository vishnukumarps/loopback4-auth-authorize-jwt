import {Entity, model, property} from '@loopback/repository';

@model()
export class Pen extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  name?: string;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'string',
  })
  color?: string;


  constructor(data?: Partial<Pen>) {
    super(data);
  }
}

export interface PenRelations {
  // describe navigational properties here
}

export type PenWithRelations = Pen & PenRelations;
