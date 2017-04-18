import 'reflect-metadata';

import * as ConfigStore from 'configstore';
import * as Nedb from 'nedb';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as types from './types';

import { ConfigurationRouter, MovieRouter, TorrentRouter } from './routes';
import { IConfig, defaultConfig } from './config';
import { IMagnetDl, MagnetDl } from './services';
import { IQBittorrent, QBittorrent } from './services';
import { ITmdb, Tmdb } from './services';
import { ITorrentService, TorrentService } from './services';

import { Container } from 'inversify';
import { Server } from './express/server';

const config = new ConfigStore('vaudeville', defaultConfig, { globalConfigPath: true });
const port = config.get('app').port;
const databaseFilePath = config.path.replace(/\.[^/.]+$/, '');

const getParentContainer = () => {
  const container = new Container();
  container.bind<IConfig>(types.config)
    .toDynamicValue(() => new ConfigStore('vaudeville', defaultConfig, { globalConfigPath: true }).all)
    .inTransientScope();
  return container;
};

const bindChildContainer = (childContainer: Container) => {
  childContainer.bind(ConfigurationRouter).to(ConfigurationRouter).inSingletonScope();
  childContainer.bind(MovieRouter).to(MovieRouter).inSingletonScope();
  childContainer.bind(TorrentRouter).to(TorrentRouter).inSingletonScope();

  childContainer.bind<IMagnetDl>(types.magnetDl).to(MagnetDl).inSingletonScope();
  childContainer.bind<ITmdb>(types.tmdb).to(Tmdb).inSingletonScope();
  childContainer.bind<IQBittorrent>(types.qBittorrent).to(QBittorrent).inSingletonScope();
  childContainer.bind<ITorrentService>(types.torrentService).to(TorrentService).inSingletonScope();

  childContainer.bind<Nedb>(types.nedb)
    .toDynamicValue(() => new Nedb({ filename: `${databaseFilePath}.db`, autoload: true }))
    .inSingletonScope();

  return childContainer;
};

const server = new Server(getParentContainer(), bindChildContainer, { rootPath: '/api' });
const app = server.setConfig((e) => {
  e.use(morgan('dev'));
  e.use(bodyParser.json());
  e.use(bodyParser.urlencoded({ extended: false }));
}).start();

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.info(`Listening on port ${port}`);
  }
});
