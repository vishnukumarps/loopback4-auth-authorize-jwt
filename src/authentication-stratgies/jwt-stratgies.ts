import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, RedirectRoute} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Request} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {TokenServiceBindings} from '../keys';
import {JWTService} from '../services/jwt-service';


export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';
  @inject(TokenServiceBindings.TOKEN_SERVICE)
  public jwtService: JWTService;

//   async authenticate(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     request: Request<ParamsDictionary, any, any, ParsedQs>,
// ): Promise<UserProfile | RedirectRoute | undefined> {

async authenticate(request: Request): Promise<UserProfile | undefined> {

    const token: string = this.extractCredentials(request);
    const userProfile = await this.jwtService.verifyToken(token);
    return Promise.resolve(userProfile);
  }

  extractCredentials(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: Request<ParamsDictionary, any, any, ParsedQs>,
  ): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization is missing');
    }
    const authHeaderValue = request.headers.authorization;

    // authorization : Bearer xxxx.yyyy.zzzz
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not type of Bearer',
      );
    }
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header has too many part is must follow this patter 'Bearer xx.yy.zz`,
      );
    }
    const token = parts[1];
    return token;
  }
}


// export interface Credentials {
//   username: string;
//   password: string;
// }

// export class BasicAuthenticationStrategy implements AuthenticationStrategy {
//   name: string = 'basic';

//   constructor(
//     @inject(UserServiceBindings.USER_SERVICE)
//     private userService: UserService,
//   ) {}

//   async authenticate(request: Request): Promise<UserProfile | undefined> {
//     const credentials: Credentials = this.extractCredentials(request);
//     const user = await this.userService.verifyCredentials(credentials);
//     const userProfile = this.userService.convertToUserProfile(user);

//     return userProfile;
//   }

//   extractCredentials(request: Request): Credentials {
//     let creds: Credentials;

//     /**
//      * Code to extract the 'basic' user credentials from the Authorization header
//      */

//     return creds;
//   }
// }
