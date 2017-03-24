import 'reflect-metadata';

import * as ConfigStore from 'configstore';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as types from './types';

import { ConfigurationRouter, MovieRouter, TorrentRouter } from './routes';
import { IConfig, defaultConfig } from './config';
import { IMagnetDl, IQBittorrent, ITmdb, MagnetDl, QBittorrent, Tmdb } from './services';

import { Container } from 'inversify';
import { Server } from './express/server';

const config = new ConfigStore('vaudeville', defaultConfig, { globalConfigPath: true })
const port = config.get('app').port;

const containerFactory = async(): Promise<Container> => {
  const container = new Container();
  container.bind(ConfigurationRouter).toSelf();
  container.bind(MovieRouter).toSelf();
  container.bind(TorrentRouter).toSelf();

  container.bind<IConfig>(types.config).toConstantValue(
    new ConfigStore('vaudeville', defaultConfig, { globalConfigPath: true }).all);
  container.bind<IMagnetDl>(types.magnetDl).to(MagnetDl);
  container.bind<ITmdb>(types.tmdb).to(Tmdb);
  container.bind<IQBittorrent>(types.qBittorrent).to(QBittorrent);

  return container;
};

containerFactory()
  .then((container) => new Server(container, { rootPath: '/api' }))
  .then((server) =>
    server.setConfig((e) => {
      e.use(morgan('dev'));
      e.use(bodyParser.json());
      e.use(bodyParser.urlencoded({ extended: false }));
    }).start())
  .then((app) =>
    app.listen(port, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.info(`Listening on port ${port}`);
      }
    }));
