import { IProductionCompany } from './tmdb-production-company';
import { IProductionCountry } from './tmdb-production-country';
import { ISpokenLanguage } from './tmdb-spoken-language';
import { ITmdbGenre } from './tmdb-genre';

export interface ITmdbMovieDetails {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: any;
  budget?: number;
  genres?: ITmdbGenre[];
  homepage?: string;
  id?: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  production_companies?: IProductionCompany[];
  production_countries?: IProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: ISpokenLanguage[];
  status?: string;
  tagline?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}
