import { IPagedCollection } from '../../../models';
import { ITmdbMovie } from '../../../models/tmdb';
import { ITmdbSearchMovieRequest } from '../requests';

export interface ITmdbSearchApi {
  movie: (request: ITmdbSearchMovieRequest) => Promise<IPagedCollection<ITmdbMovie>>;
}
