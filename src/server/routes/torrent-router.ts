import * as express from 'express';
import * as types from '../types';

import { IMagnetDl, IQBittorrent, ITmdb, ITorrentService } from '../services';
import { get, route } from '../express/decorators';
import { inject, injectable } from 'inversify';

@injectable()
@route('/v1/torrents')
export class TorrentRouter {
  constructor(
    @inject(types.magnetDl) private magnetDl: IMagnetDl,
    @inject(types.qBittorrent) private qBittorrent: IQBittorrent,
    @inject(types.tmdb) private tmdb: ITmdb,
    @inject(types.torrentService) private torrentService: ITorrentService) { }

  @get('/magnet-dl')
  public async searchTorrents(req: express.Request, res: express.Response) {
    const torrents = await this.magnetDl.getTorrents(req.query.title, Number(req.query.year), 1);

    res.end(JSON.stringify(torrents));
  }

  @get('/rank')
  public async rankTorrents(req: express.Request, res: express.Response) {
    const movieDetails = await this.tmdb.movie.details({ movieId: req.query.movieId });
    const torrents = await this.magnetDl.getTorrents(
      movieDetails.title,
      2009);
    const rankedTorrents = await this.torrentService.rankTorrents(torrents, movieDetails);

    res.end(JSON.stringify({
      rankedTorrents:
        rankedTorrents.map((rankedTorrent) => {
          return {
            torrent: rankedTorrent.torrent,
            rank: rankedTorrent.rank,
            quality: rankedTorrent.quality.label,
          };
        }),
        qualities: [...new Set(rankedTorrents.map((rankedTorrent) => rankedTorrent.quality))],
      }
    ));

    res.end(JSON.stringify(rankedTorrents));
  }
}
