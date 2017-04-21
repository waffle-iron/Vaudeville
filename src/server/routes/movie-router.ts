import * as express from 'express';
import * as types from '../types';

import { get, route } from '../express/decorators';
import { inject, injectable } from 'inversify';

import { ITmdb } from '../services/tmdb';

@injectable()
@route('/v1/movies')
export class MovieRouter {
  constructor(
    @inject(types.tmdb) private tmdb: ITmdb) { }

  @get('/')
  public async getMovies(req: express.Request, res: express.Response) {
    const title: string = req.query.title;
    const movies = await this.tmdb.search.movie({ query: title });
    res.end(JSON.stringify(movies));
  }

  @get('/config')
  public async getConfig(req: express.Request, res: express.Response) {
    const config = await this.tmdb.configuration();
    res.end(JSON.stringify(config));
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
}
