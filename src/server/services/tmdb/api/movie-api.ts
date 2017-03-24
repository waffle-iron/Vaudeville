import { IPagedCollection } from '../../../models';
import { ITmdbMovie } from '../../../models/tmdb';
import { ITmdbMoviePopularRequest } from '../requests';

export interface ITmdbMovieApi {
  popular: (request: ITmdbMoviePopularRequest) => Promise<IPagedCollection<ITmdbMovie>>;
}
