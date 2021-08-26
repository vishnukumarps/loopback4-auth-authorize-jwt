import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';

import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTStrategy } from './authentication-stratgies/jwt-stratgies';
import { SECURITY_SCHEME_SPEC } from '@loopback/authentication-jwt';
import { PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants, UserServiceBindings } from './keys';
import { JWTService } from './services/jwt-service';
import { MyUserService } from './services/user-service';
import { BcryptHasher } from './services/hash.password';
import { MySequence } from './sequence';


export {ApplicationConfig};

export class DemoappApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.setupBinding();

    // Add security spec
    this.addSecuritySpec();
     this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this as any, JWTStrategy)
    // Set up the custom sequence
    this.sequence(MySequence);



    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBinding(): void {
    // this.bind('service.hasher').toClass(BcryptHasher);
    // this.bind('rounds').to(10);
   // this.bind('service.user.service').toClass(MyUserService)
    // this.bind('service.jwt.service').toClass(JWTService);
    // this.bind('authentication.jwt.secret').to('dvchgdvcjsdbhcbdjbvjb');
    // this.bind('authentication.jwt.expiresIn').to('7h');

    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
  }
  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'test application',
        version: '1.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          // secure all endpoints with 'jwt'
          jwt: [],
        },
      ],
      servers: [{url: '/'}],
    });
  }
}
