import { IQuality, ITorrentResult } from './';

interface ITorrentRanking {
  torrent: ITorrentResult;
  quality?: IQuality;
  rank: number;
}

export { ITorrentRanking };
