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
}

export { IConfig }
