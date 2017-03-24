import * as request from 'request-promise-native';
import * as types from '../../types';

import { IPagedCollection, ITmdbConfiguration, ITmdbGenreList, ITmdbMovie } from './models';
import { ITmdbConfigurationApi, ITmdbGenreApi, ITmdbMovieApi, ITmdbSearchApi } from './api';
import { ITmdbMoviePopularRequest, ITmdbSearchMovieRequest } from './requests';
import { inject, injectable } from 'inversify';

import { IConfig } from '../../config';

interface ITmdb {
  configuration: ITmdbConfigurationApi;
  genre: ITmdbGenreApi;
  movie: ITmdbMovieApi;
  search: ITmdbSearchApi;
}

@injectable()
class Tmdb implements ITmdb {
  private static readonly baseUrl = 'https://api.themoviedb.org';

  private readonly apiKey: string;

  private cache: {
    configuration: ITmdbConfiguration;
    movieGenres: ITmdbGenreList;
  };

  constructor(
    @inject(types.config) config: IConfig) {
      this.cache = { configuration: undefined, movieGenres: undefined };
      this.apiKey = config.tmdb.apiKey;
  }

  private url(path: string, request?: any): string {
    let url = `${Tmdb.baseUrl}/3/${path}?api_key=${this.apiKey}`;
    if (request) {
      for (const key in request) {
        if (request[key]) {
          url += `&${toUnderscore(key)}=${encodeURIComponent(request[key])}`;
        }
      }
    }
    return url;
  }

  public configuration: ITmdbConfigurationApi = async() => {
    if (!this.cache.configuration) {
      const response = await request.get(this.url('configuration'));
      this.cache.configuration = await response.json();
    }
    return this.cache.configuration;
  }

  public genre: ITmdbGenreApi = {
    movie: {
      list: async(req: { language?: string }) : Promise<ITmdbGenreList> => {
        if (!this.cache.movieGenres) {
          const response = await request.get(this.url('genre/movie/list', req));
          this.cache.movieGenres = await response.json();
        }
        return this.cache.movieGenres;
      },
    },
  };

  public movie: ITmdbMovieApi = {
    popular: async(req: ITmdbMoviePopularRequest) : Promise<IPagedCollection<ITmdbMovie>> => {
      const response = await request.get(this.url('movie/popular', req));
      return response.json();
    }
  }

  public search: ITmdbSearchApi = {
    movie: async(req: ITmdbSearchMovieRequest) : Promise<IPagedCollection<ITmdbMovie>> => {
      const response = await request.get(this.url('search/movie', req));
      return response.json();
    },
  };
}

const toUnderscore = (str: string): string  => {
  return str.replace(/([A-Z])/g, ($1) => { return '_' + $1.toLowerCase(); });
};

export { ITmdb, Tmdb };
