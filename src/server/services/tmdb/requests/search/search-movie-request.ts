export interface ITmdbSearchMovieRequest {
  query: string;
  language?: string;
  page?: number;
  includeAdult?: boolean;
  year?: number;
  primaryReleaseYear?: number;
}
