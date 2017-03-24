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
};
