import * as request from 'request-promise-native';
import * as types from '../../types';

import { IConfig, IPagedCollection } from 'models';
import { ITmdbConfiguration, ITmdbGenreList, ITmdbMovie, ITmdbMovieDetails } from 'models';
import { ITmdbConfigurationApi, ITmdbGenreApi, ITmdbMovieApi, ITmdbSearchApi } from './api';
import { ITmdbMovieDetailsRequest, ITmdbMoviePopularRequest, ITmdbSearchMovieRequest } from './requests';
import { inject, injectable } from 'inversify';

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

  private static cache: {
    configuration: ITmdbConfiguration;
    movieGenres: ITmdbGenreList;
  } = { configuration: undefined, movieGenres: undefined };

  constructor(
    @inject(types.config) config: IConfig) {
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
    if (!Tmdb.cache.configuration) {
      const response = await request.get(this.url('configuration'), { json: true });
      Tmdb.cache.configuration = response;
    }
    return Tmdb.cache.configuration;
  }

  public genre: ITmdbGenreApi = {
    movie: {
      list: async(req: { language?: string }) : Promise<ITmdbGenreList> => {
        if (!Tmdb.cache.movieGenres) {
          const response = await request.get(this.url('genre/movie/list', req), { json: true });
          Tmdb.cache.movieGenres = response;
        }
        return Tmdb.cache.movieGenres;
      },
    },
  };

  public movie: ITmdbMovieApi = {
    popular: async(req: ITmdbMoviePopularRequest) : Promise<IPagedCollection<ITmdbMovie>> => {
      const response = await request.get(this.url('movie/popular', req), { json: true });
      return response;
    },
    details: async(req: ITmdbMovieDetailsRequest) : Promise<ITmdbMovieDetails> => {
      const response = await request.get(this.url(`movie/${req.movieId}`), { json: true });
      return response;
    },
  };

  public search: ITmdbSearchApi = {
    movie: async(req: ITmdbSearchMovieRequest) : Promise<IPagedCollection<ITmdbMovie>> => {
      const response = await request.get(this.url('search/movie', req), { json: true });
      return response;
    },
  };
}

const toUnderscore = (str: string): string  => {
  return str.replace(/([A-Z])/g, ($1) => { return '_' + $1.toLowerCase(); });
};

export { ITmdb, Tmdb };
