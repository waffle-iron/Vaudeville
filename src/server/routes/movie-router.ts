import * as express from 'express';

import { get, route } from '../express/decorators';

import { MagnetDl } from '../services/magnet-dl/magnet-dl';
import { Tmdb } from '../services/tmdb';
import { injectable } from 'inversify';

@injectable()
@route('/v1/movies')
export class MovieRouter {
  constructor(private tmdb: Tmdb) {
  }

  @get('/')
  public async getMovies(req: express.Request, res: express.Response) {
    const title: string = req.query.title;
    const movies = await this.tmdb.search.movie({ query: title });
    res.end(JSON.stringify(movies));
  }

  @get('/genres')
  public async getGenres(req: express.Request, res: express.Response) {
    const language: string = req.query.language;
    const genreList = await this.tmdb.genre.movie.list(language);
    res.end(JSON.stringify(genreList.genres));
  }

  @get('/popular')
  public async getPopularMovies(req: express.Request, res: express.Response) {
    const popularMovies = await this.tmdb.movie.popular(req.query);
    res.end(JSON.stringify(popularMovies));
  }

  @get('/test')
  public async gogo(req: express.Request, res: express.Response) {
    const magnetDl = new MagnetDl();
  }
}
