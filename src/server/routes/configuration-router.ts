import * as express from 'express';
import * as types from '../types';

import { get, route } from '../express/decorators';
import { inject, injectable } from 'inversify';

import { ITmdb } from '../services/tmdb';

@injectable()
@route('/v1/configuration')
export class ConfigurationRouter {
  constructor(
    @inject(types.tmdb) private tmdb: ITmdb) {
  }

  @get('/')
  public async getConfiguration(req: express.Request, res: express.Response) {
    const config = await this.tmdb.configuration();
    res.end(JSON.stringify(config));
  }
}
