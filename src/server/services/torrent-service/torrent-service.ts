import * as types from '../../types';

import { IQuality, ITmdbMovieDetails, ITorrentRanking, ITorrentResult } from '../../models';
import { inject, injectable } from 'inversify';

import { IConfig } from '../../config';

interface ITorrentService {
  rankTorrents(torrents: ITorrentResult[], movieDetails: ITmdbMovieDetails): ITorrentRanking[];
}

@injectable()
class TorrentService implements ITorrentService {
  constructor(
    @inject(types.config) private config: IConfig) {
  }

  public rankTorrents(torrents: ITorrentResult[], movieDetails: ITmdbMovieDetails) {
    return torrents
      .map((torrent) => this.rankTorrent(torrent, movieDetails))
      .filter((rankedTorrent) => rankedTorrent.quality != null && rankedTorrent.rank > 0)
      .sort((left, right) => left.quality.ordinal === right.quality.ordinal
        ? right.rank - left.rank
        : left.quality.ordinal - right.quality.ordinal);
  }

  public rankTorrent(torrent: ITorrentResult, movieDetails: ITmdbMovieDetails): ITorrentRanking {
    const quality = this.getTorrentQuality(torrent, movieDetails);
    const rank = this.getTorrentRank(torrent, movieDetails, quality);

    return {
      torrent,
      quality,
      rank,
    };
  }

  private getTorrentQuality(torrent: ITorrentResult, movieDetails: ITmdbMovieDetails): IQuality {
    return this.config.torrent.ranking.qualities
      .find((quality) => {
        const torrentName = torrent.name.toLocaleLowerCase();
        const regex = new RegExp(quality.identifiers.map((identifier) => '\\b' + identifier + '\\b').join('|'));
        const torrentBitRate = this.getTorrentBitrate(torrent.byteSize, movieDetails.runtime);
        if ((quality.isEnabled) &&
            (quality.minBitRate == null || torrentBitRate > quality.minBitRate) &&
            (quality.maxBitRate == null || torrentBitRate < quality.maxBitRate) &&
            (regex.test(torrentName))) {
              return true;
        }
        return false;
      });
  }

  private getTorrentBitrate(byteSize: number, runtimeMinutes: number): number {
    return ((byteSize * 8) / (runtimeMinutes * 60)) / (1024 * 1024);
  }

  private getTorrentRank(torrent: ITorrentResult, movieDetails: ITmdbMovieDetails, quality: IQuality): number {
    if (!torrent || !movieDetails || !quality) {
      return 0;
    }

    const rankConfig = this.config.torrent.ranking;
    if (torrent.seeders === 0 || torrent.seeders < rankConfig.seeds.lowerBounds) {
      return 0;
    }

    const totalWeight = rankConfig.weights.bitRate + rankConfig.weights.keywords + rankConfig.weights.seeds;

    const getSeedRank = (seeds: number, scale: number) => (seeds / (seeds + scale));

    const seedMax = rankConfig.seeds.upperBounds == null ? 50 : rankConfig.seeds.upperBounds;
    const scale = seedMax / 4;
    const seedRank = Math.min(Math.max(getSeedRank(torrent.seeders, scale) / getSeedRank(seedMax, scale), 0), 1);

    const seedWeight = rankConfig.weights.seeds / totalWeight;
    const weightedSeedRank = seedRank * seedWeight;

    const bitRateWeight = rankConfig.weights.bitRate / totalWeight;
    const torrentBitRate = this.getTorrentBitrate(torrent.byteSize, movieDetails.runtime);
    const bitRateRank = quality.preferLarger
      ? (torrentBitRate - quality.minBitRate) / quality.maxBitRate
      : (quality.maxBitRate - quality.minBitRate) / quality.maxBitRate;
    const weightedBitRateRank = bitRateRank * bitRateWeight;

    return weightedSeedRank + weightedBitRateRank;
  }
}

export { ITorrentService, TorrentService };
