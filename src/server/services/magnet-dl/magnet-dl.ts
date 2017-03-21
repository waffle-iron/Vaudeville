import * as cheerio from 'cheerio';
import * as request from 'request-promise-native';

import { injectable } from 'inversify';

interface ITorrentResult {
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

@injectable()
class MagnetDl {
  private static buildSearchUrl(title: string, year: number, page: number): string {
    let searchTerm = `${title} ${year.toString()}`;
    searchTerm = searchTerm.toLocaleLowerCase();
    searchTerm = searchTerm.replace(/[':]/g, '');
    searchTerm = searchTerm.replace(/ /g, '-');

    return `http://www.magnetdl.com/${searchTerm.charAt(0)}/${searchTerm}/se/desc/${page.toString()}/`;
  }

  public async getTorrents(title: string, year: number, page: number): Promise<ITorrentResult[]> {
    const searchUrl = MagnetDl.buildSearchUrl(title, year, page);
    console.log(searchUrl);
    const response: string = await request(searchUrl);
    const $ = cheerio.load(response);

    const body = $('table.download tbody').first();
    const rows = $('tr', body).filter((idx, e) => $('td', e).length > 1).toArray();
    return rows.map((element) => {
      const magnetLink = $('td.m a', element);
      const torrentLink = $('td.n a', element);

      const id = Number(torrentLink.attr('href').split('/')[2]);
      const name = torrentLink.attr('title');
      const magnetUrl = magnetLink.attr('href');
      const pageUrl = torrentLink.attr('href');
      const fileSize = $('td', element).eq(5).text();
      const byteSize = this.filesizeToBytes(fileSize);
      const age = $('td', element).eq(2).text();
      const seeders = Number($('td.s', element).text());
      const leechers = Number($('td.l', element).text());

      return { id, name, magnetUrl, pageUrl, fileSize, byteSize, age, seeders, leechers };
    });
  }

  private filesizeToBytes(filesize: string): number {
    filesize = filesize.toLocaleUpperCase();
    filesize = filesize.replace(/[^0-9KMGTPEB]/g, '');

    const suffixes = [ 'EB', 'PB', 'TB', 'GB', 'MB', 'KB', 'B' ];
    const suffixIndex = suffixes.findIndex((suffix) => filesize.endsWith(suffix));
    const suffix = suffixes[suffixIndex];
    const size = Number(filesize.replace(suffix, ''));
    const exp = (suffixes.length - 1) - suffixIndex;
    const byteSize = (size * Math.pow(1024, exp));
    return byteSize;
  }
}

export { MagnetDl };
