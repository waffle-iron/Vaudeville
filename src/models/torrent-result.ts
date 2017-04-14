export interface ITorrentResult {
  id: number;
  name: string;
  magnetUrl: string;
  pageUrl: string;
  fileSize: string;
  byteSize: number;
  age: string;
  seeders: number;
  leechers: number;
}
