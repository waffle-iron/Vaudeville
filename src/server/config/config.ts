interface IQuality {
  label?: string;
  ordinal?: number;
  isEnabled?: boolean;
  isStopping?: boolean;
  identifiers?: string[];
  minBitRate?: number;
  maxBitRate?: number;
  preferLarger?: boolean;
}

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
    rank?: {
      seeds?: {
        lowerBounds?: number;
        upperBounds?: number;
        weight?: number;
      };
      keywords?: {
        required?: string[];
        excluded?: string[];
        weighted?: { keywords: string[], weight: number };
      };
      defaultQuality?: IQuality;
      qualities?: IQuality[];
    };
  };
}

export { IConfig, IQuality }
