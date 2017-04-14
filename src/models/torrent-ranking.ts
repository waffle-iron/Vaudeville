import { IQuality } from './quality';
import { ITorrentResult } from './torrent-result';

export interface ITorrentRanking {
  torrent: ITorrentResult;
  quality?: IQuality;
  rank: number;
}
