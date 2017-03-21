import * as requestPromise from 'request-promise-native';

const request = requestPromise.defaults({ jar: true });

class qBittorrent {
  public static async connect(hostUrl: string, username?: string, password?: string) {
    if (username && password) {
      return await new qBittorrent(hostUrl).login(username, password);
    } else {
      return new qBittorrent(hostUrl);
    }
  }

  private constructor(private hostUrl: string) {
    if (!this.hostUrl) {
      this.hostUrl = 'http://localhost:8080';
    }
    if (!(hostUrl.startsWith('http://') || hostUrl.startsWith('https://'))) {
      this.hostUrl = `http://${hostUrl}`;
    }
  }

  public async login(username: string, password: string): Promise<qBittorrent> {
    await request.post(`${this.hostUrl}/login`, { form: { username, password } });
    return this;
  }
}

export { qBittorrent }
