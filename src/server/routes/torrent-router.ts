import * as express from 'express';

import { MagnetDl, qBittorrent } from '../services';
import { get, route } from '../express/decorators';

import { injectable } from 'inversify';

@injectable()
@route('/v1/torrents')
export class TorrentRouter {
  constructor(
    private magnetDl: MagnetDl,
    private qBittorrent: qBittorrent) { }

  @get('/magnet-dl')
  public async searchTorrents(req: express.Request, res: express.Response) {
    const torrents = await this.magnetDl.getTorrents(req.query.title, Number(req.query.year), 1);

    res.end(JSON.stringify(torrents));
  }
}
