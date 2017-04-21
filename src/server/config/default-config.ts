import { IConfig } from 'models';

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
    ranking: {
      weights: {
        seeds: 40,
        bitRate: 10,
        keywords: 20,
      },
      seeds: {
        lowerBounds: 1,
        upperBounds: null,
      },
      defaultQuality: '1080p',
      qualities: [
        {
          label: '2160p',
          ordinal: 1,
          isEnabled: true,
          identifiers: ['4k', '2160', '2160p'],
          minBitRate: 32,
          maxBitRate: 64,
          preferLarger: false,
        },
        {
          label: '1440p',
          ordinal: 2,
          isEnabled: true,
          identifiers: ['1440', '1440p'],
          minBitRate: 16,
          maxBitRate: 32,
          preferLarger: false,
        },
        {
          label: '1080p',
          ordinal: 3,
          isEnabled: true,
          identifiers: ['1080', '1080p'],
          minBitRate: 8,
          maxBitRate: 16,
          preferLarger: true,
        },
        {
          label: '720p',
          ordinal: 4,
          isEnabled: true,
          identifiers: ['720', '720p'],
          minBitRate: 4,
          maxBitRate: 10,
          preferLarger: true,
        },
        {
          label: '480p',
          ordinal: 5,
          isEnabled: true,
          identifiers: ['480', '480p'],
          minBitRate: 2.5,
          maxBitRate: 5,
          preferLarger: true,
        },
        {
          label: '360p',
          ordinal: 6,
          isEnabled: true,
          identifiers: ['360', '360p'],
          minBitRate: 1,
          maxBitRate: 2,
          preferLarger: true,
        },
      ],
    },
  },
};
