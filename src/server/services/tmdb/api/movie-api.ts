import { IPagedCollection, ITmdbMovie } from '../models';

import { ITmdbMoviePopularRequest } from '../requests';

export interface ITmdbMovieApi {
  popular: (request: ITmdbMoviePopularRequest) => Promise<IPagedCollection<ITmdbMovie>>;
}
