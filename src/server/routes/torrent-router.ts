import * as express from 'express';
import * as types from '../types';

import { IMagnetDl, IQBittorrent, ITmdb, ITorrentService } from '../services';
import { get, route } from '../express/decorators';
import { inject, injectable } from 'inversify';

import { IConfig } from 'models';

@injectable()
@route('/v1/torrents')
export class TorrentRouter {
  constructor(
    @inject(types.magnetDl) private magnetDl: IMagnetDl,
    @inject(types.qBittorrent) private qBittorrent: IQBittorrent,
    @inject(types.tmdb) private tmdb: ITmdb,
    @inject(types.torrentService) private torrentService: ITorrentService,
    @inject(types.config) private config: IConfig) { }

  @get('/magnet-dl')
  public async searchTorrents(req: express.Request, res: express.Response) {
    const torrents = await this.magnetDl.getTorrents(req.query.title, Number(req.query.year), 1);
    res.end(JSON.stringify(torrents));
  }

  @get('/download/:movieId')
  public async rankTorrents(req: express.Request, res: express.Response) {
    const maxQualityLabel: string = req.query.maxQuality;
    const movieDetails = await this.tmdb.movie.details({ movieId: req.params.movieId });

    const torrents =
      await this.magnetDl.getTorrents(
        movieDetails.title,
        Number(movieDetails.release_date.substr(0, 4)));
    const maxQuality = this.config.torrent.ranking.qualities.find((q) => q.label === maxQualityLabel);
    const rankedTorrents = await this.torrentService.rankTorrents(torrents, movieDetails, maxQuality);

    if (rankedTorrents.length > 0) {
      const torrentToDownload = rankedTorrents[0];

      if (torrentToDownload) {
        await (await this.qBittorrent.login('voila', 'vaudeville')).add(torrentToDownload.torrent.magnetUrl);
      }
    }

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
