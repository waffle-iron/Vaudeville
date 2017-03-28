import { IConfig } from './config';

export const defaultConfig: IConfig = {
  app: {
    port: 3000,
  },
  qBittorrent: {
    hostUrl: 'http://localhost:8080',
  },
  tmdb: {
    apiKey: '6d8f88d8825ab70a5d2e836a4b448cbe',
  },
  torrent: {
    rank: {
      seeds: {
        lowerBounds: 1,
        upperBounds: null,
        weight: 50,
      },
      defaultQuality: {
        label: 'default',
        identifiers: null,
      },
      qualities: [{
        label: '1080p',
        ordinal: 1,
        isEnabled: false,
        isStopping: false,
        identifiers: ['1080p', '1080'],
        minBitRate: 8,
        maxBitRate: 16,
        preferLarger: true,
      }],
    },
  },
};
