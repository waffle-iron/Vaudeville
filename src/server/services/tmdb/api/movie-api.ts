import { IPagedCollection, ITmdbMovie, ITmdbMovieDetails } from 'models';
import { ITmdbMovieDetailsRequest, ITmdbMoviePopularRequest } from '../requests';

export interface ITmdbMovieApi {
  popular: (request: ITmdbMoviePopularRequest) => Promise<IPagedCollection<ITmdbMovie>>;
  details: (request: ITmdbMovieDetailsRequest) => Promise<ITmdbMovieDetails>;
}
