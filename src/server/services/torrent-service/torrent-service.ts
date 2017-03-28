import * as types from '../../types';

import { inject, injectable } from 'inversify';

import { IConfig } from '../../config';
import { IQuality } from '../../config';
import { ITmdbMovieDetails } from '../../models/tmdb';
import { ITorrentResult } from '../../models';

interface ITorrentService {
  rankTorrents(torrents: ITorrentResult[], movieDetails: ITmdbMovieDetails):
    Array<{ torrent: ITorrentResult; quality: IQuality; rank: number }>;
}

@injectable()
class TorrentService implements ITorrentService {
  constructor(
    @inject(types.config) private config: IConfig) {
  }

  public rankTorrents(torrents: ITorrentResult[], movieDetails: ITmdbMovieDetails) {
    return torrents.map((torrent) => {
      const matchedQuality = this.config.torrent.rank.qualities
        .find((quality) => {
          const torrentName = torrent.name.toLocaleLowerCase();
          const regex = new RegExp(quality.identifiers.map((identifier) => '\\b' + identifier + '\\b').join('|'));
          const runtimeSeconds = movieDetails.runtime * 60;
          if ((quality.isEnabled) &&
              (quality.minBitRate == null || torrent.byteSize > (quality.minBitRate * runtimeSeconds * 1024 * 1024)) &&
              (quality.maxBitRate == null || torrent.byteSize < (quality.maxBitRate * runtimeSeconds * 1024 * 1024)) &&
              (regex.test(torrentName))) {
                return true;
          }
          return false;
        });

      return {
        torrent,
        quality: matchedQuality,
        rank: this.rankTorrent(torrent),
      };
    })
    .filter((rankedTorrent) => rankedTorrent.quality != null && rankedTorrent.rank > 0)
    .sort((left, right) => left.quality.ordinal === right.quality.ordinal
      ? left.rank - right.rank
      : left.quality.ordinal - right.quality.ordinal);
  }

  public rankTorrent(torrent: ITorrentResult): number {
    const rankConfig = this.config.torrent.rank;
    if (torrent.seeders === 0 || torrent.seeders < rankConfig.seeds.lowerBounds) {
      return 0;
    }

    const totalWeight = rankConfig.seeds.weight;

    const seedWeight = rankConfig.seeds.weight / totalWeight;
    const seedRank = (Math.min(torrent.seeders, rankConfig.seeds.upperBounds) / rankConfig.seeds.upperBounds);
    const weightedSeedRank = seedRank * seedWeight;

    return weightedSeedRank;
  }
}
