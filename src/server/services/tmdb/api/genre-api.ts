import { ITmdbGenreList } from '../../../models/tmdb';

export interface ITmdbGenreApi {
  movie: {
    list: (language?: string) => Promise<ITmdbGenreList>;
  };
}
