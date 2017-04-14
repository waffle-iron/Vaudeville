import { IPagedCollection, ITmdbMovie } from 'models';

import { ITmdbSearchMovieRequest } from '../requests';

export interface ITmdbSearchApi {
  movie: (request: ITmdbSearchMovieRequest) => Promise<IPagedCollection<ITmdbMovie>>;
}
