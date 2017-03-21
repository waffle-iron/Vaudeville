import { IPagedCollection, ITmdbConfiguration, ITmdbGenreList, ITmdbMovie } from './models';
import { ITmdbConfigurationApi, ITmdbGenreApi, ITmdbMovieApi, ITmdbSearchApi } from './api';
import { ITmdbMoviePopularRequest, ITmdbSearchMovieRequest } from './requests';

import fetch from 'node-fetch';

class Tmdb {
  private static readonly baseUrl = 'https://api.themoviedb.org';

  // TODO: Do not store this information statically.
  private cache: {
    configuration: ITmdbConfiguration;
    movieGenres: ITmdbGenreList;
  };

  constructor(private apiKey: string) {
    this.cache = { configuration: undefined, movieGenres: undefined };
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
      const response = await fetch(this.url('configuration'), { method: 'GET' });
      this.cache.configuration = await response.json();
    }
    return this.cache.configuration;
  }

  public genre: ITmdbGenreApi = {
    movie: {
      list: async(request: { language?: string }) : Promise<ITmdbGenreList> => {
        if (!this.cache.movieGenres) {
          const response = await fetch(this.url('genre/movie/list', request), { method: 'GET' });
          this.cache.movieGenres = await response.json();
        }
        return this.cache.movieGenres;
      },
    },
  };

  public movie: ITmdbMovieApi = {
    popular: async(request: ITmdbMoviePopularRequest) : Promise<IPagedCollection<ITmdbMovie>> => {
      const response = await fetch(this.url('movie/popular', request), { method: 'GET' });
      return response.json();
    }
  }

  public search: ITmdbSearchApi = {
    movie: async(request: ITmdbSearchMovieRequest) : Promise<IPagedCollection<ITmdbMovie>> => {
      const response = await fetch(this.url('search/movie', request), { method: 'GET' });
      return response.json();
    },
  };
}

const toUnderscore = (str: string): string  => {
  return str.replace(/([A-Z])/g, ($1) => { return '_' + $1.toLowerCase(); });
};

export { Tmdb };
