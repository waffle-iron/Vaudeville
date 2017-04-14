import { IQuality } from 'models';

interface IConfig {
  app?: {
    port?: number;
  };
  qBittorrent?: {
    hostUrl?: string;
    username?: string;
    password?: string;
  };
  tmdb?: {
    apiKey?: string;
  };
  torrent?: {
    ranking?: {
      weights: {
        seeds: number;
        keywords: number;
        bitRate: number;
      }
      seeds?: {
        lowerBounds?: number;
        upperBounds?: number;
      };
      keywords?: {
        required?: string[];
        excluded?: string[];
        weighted?: { keywords: string[], weight: number };
      };
      qualities: IQuality[];
    };
  };
}

export { IConfig }
