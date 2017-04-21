import * as express from 'express';
import * as types from '../types';

import { get, route } from '../express/decorators';
import { inject, injectable } from 'inversify';

import { IConfig } from 'models';

@injectable()
@route('/v1/configuration')
export class ConfigurationRouter {
  constructor(
    @inject(types.config) private config: IConfig) { }

  @get('/')
  public async getQualities(req: express.Request, res: express.Response) {
    res.end(JSON.stringify(this.config));
  }
}
