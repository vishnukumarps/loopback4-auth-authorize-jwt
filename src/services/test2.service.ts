import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';

/*
 * Fix the service type. Possible options can be:
 * - import {Test2} from 'your-module';
 * - export type Test2 = string;
 * - export interface Test2 {}
 */
export type Test2 = unknown;

@injectable({scope: BindingScope.TRANSIENT})
export class Test2Provider implements Provider<Test2> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    // Add your implementation here
    throw new Error('To be implemented');
  }
}
