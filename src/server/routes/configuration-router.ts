import * as express from 'express';

import { get, route } from '../express/decorators';

import { Tmdb } from '../services/tmdb';
import { injectable } from 'inversify';

@injectable()
@route('/v1/configuration')
export class ConfigurationRouter {
  constructor(private tmdb: Tmdb) {
  }

  @get('/')
  public async getConfiguration(req: express.Request, res: express.Response) {
    const config = await this.tmdb.configuration();
    res.end(JSON.stringify(config));
  }
}
