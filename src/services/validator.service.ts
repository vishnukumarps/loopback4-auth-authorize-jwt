// import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';

// /*
//  * Fix the service type. Possible options can be:
//  * - import {Validator} from 'your-module';
//  * - export type Validator = string;
//  * - export interface Validator {}
//  */
// export type Validator = unknown;

// @injectable({scope: BindingScope.TRANSIENT})
// export class ValidatorProvider implements Provider<Validator> {
//   constructor(/* Add @inject to inject parameters */) {}

//   value() {
//     // Add your implementation here
//     throw new Error('To be implemented');
//   }
// }



import {HttpErrors} from '@loopback/rest';
  import * as isEmail from 'isemail';
  import {Credentials} from '../repositories/index';

  export function validateCredentials(credentials: Credentials) {
    if (!isEmail.validate(credentials.email)) {
      throw new HttpErrors.UnprocessableEntity('invalid Email');
    }
    if (credentials.password.length < 8) {
      throw new HttpErrors.UnprocessableEntity('password length should be greater than 8')
    }
  }