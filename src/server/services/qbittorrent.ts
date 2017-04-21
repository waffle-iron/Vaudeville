import * as requestPromise from 'request-promise-native';
import * as types from '../types';

import { inject, injectable } from 'inversify';

import { IConfig } from 'models';

const request = requestPromise.defaults({ jar: true });

interface IQBittorrent {
  login(username: string, password: string): Promise<IQBittorrent>;
  add(url: string, savePath?: string, category?: string): Promise<IQBittorrent>;
}

@injectable()
class QBittorrent implements IQBittorrent {
  private readonly hostUrl?: string;
  private readonly username?: string;
  private readonly password?: string;

  constructor(
    @inject(types.config) config: IConfig) {
      this.hostUrl = config.qBittorrent.hostUrl;
      this.username = config.qBittorrent.username;
      this.password = config.qBittorrent.password;
    }

  public async login(username?: string, password?: string): Promise<IQBittorrent> {
    await request.post(`${this.hostUrl}/login`, {
      form: {
        username: username ? username : this.username,
        password: password ? password : this.password,
      },
    });
    return this;
  }

  public async add(url: string, savePath?: string, category?: string): Promise<IQBittorrent> {
    await request.post(`${this.hostUrl}/command/download`, {
      formData: {
        urls: url,
        savepath: savePath,
        category,
      },
    });
    return this;
  }
}

export { IQBittorrent, QBittorrent }
