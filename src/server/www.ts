import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

import { ConfigurationRouter, MovieRouter, TorrentRouter } from './routes';
import { MagnetDl, Tmdb, qBittorrent } from './services';

import { Container } from 'inversify';
import { Server } from './express/server';

const isDev = process.env.NODE_ENV !== 'production';
const port = isDev ? 3000 : process.env.PORT;

const apiKey: string = '6d8f88d8825ab70a5d2e836a4b448cbe';

const containerFactory = async(): Promise<Container> => {
  const container = new Container();
  container.bind(ConfigurationRouter).toSelf();
  container.bind(MovieRouter).toSelf();
  container.bind(TorrentRouter).toSelf();

  container.bind(MagnetDl).toSelf();
  container.bind(Tmdb).toConstantValue(new Tmdb(apiKey));
  container.bind(qBittorrent).to(await qBittorrent.connect('localhost:9001', 'voila', 'vaudevillianveteran'));

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
