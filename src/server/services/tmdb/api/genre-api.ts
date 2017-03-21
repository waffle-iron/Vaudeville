import { ITmdbGenreList } from '../models';

export interface ITmdbGenreApi {
  movie: {
    list: (language?: string) => Promise<ITmdbGenreList>;
  };
}
