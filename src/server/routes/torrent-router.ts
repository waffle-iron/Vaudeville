import * as express from 'express';
import * as types from '../types';

import { IMagnetDl, IQBittorrent } from '../services';
import { get, route } from '../express/decorators';
import { inject, injectable } from 'inversify';

@injectable()
@route('/v1/torrents')
export class TorrentRouter {
  constructor(
    @inject(types.magnetDl) private magnetDl: IMagnetDl,
    @inject(types.qBittorrent) private qBittorrent: IQBittorrent) { }

  @get('/magnet-dl')
  public async searchTorrents(req: express.Request, res: express.Response) {
    const torrents = await this.magnetDl.getTorrents(req.query.title, Number(req.query.year), 1);

    res.end(JSON.stringify(torrents));
  }
}
