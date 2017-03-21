import * as React from 'react';

import { IMovieCardProps } from '../components';
import { MovieList } from '../components';

export interface IMovieListContainerProps {
  searchToken: string;
}

export interface IMovieListContainerState {
  results: IMovieCardProps[];
}

export class MovieListContainer extends React.Component<IMovieListContainerProps, IMovieListContainerState> {
  constructor(props: IMovieListContainerProps) {
    super(props);
    this.state = {
      results: [],
    };
  }

  public async componentDidMount() {
    const movieResults = await this.search(this.props.searchToken);
    this.setState({ results: movieResults });
  }

  public async search(name?: string): Promise<IMovieCardProps[]> {
    const pagedMovies = await fetch(`/api/v1/movies/?name=${name}`).then<any>((res) => res.json());
    //const pagedMovies = await fetch(`/api/v1/movies/popular`).then<any>((res) => res.json());
    const configuration = await fetch('/api/v1/configuration').then<any>((res) => res.json());
    const genres = await fetch('/api/v1/movies/genres').then<any>((res) => res.json());

    const mappedGenres = new Map<number, string>(genres.map((g) => [g.id as number, g.name as string]));

    return pagedMovies.results.map((tmdbMovie) => {
      const movieCardProp: IMovieCardProps = {
        key: tmdbMovie.id,
        title: tmdbMovie.title,
        genres: this.getGenreNames(tmdbMovie.genre_ids, mappedGenres),
        poster:
          this.buildImageUrl(
            configuration.images.secure_base_url,
            configuration.images.poster_sizes,
            300,
            tmdbMovie.poster_path),
        rating: tmdbMovie.vote_average,
        ratingMax: 10,
      };

      return movieCardProp;
    });
  }

  private getGenreNames(genreIds: number[], genres: Map<number, string>): string[] {
    if (!genreIds || !genres) {
      return [];
    }

    return genreIds.map((genreId) => genres.get(genreId)).sort((a, b) => a > b ? 1 : -1);
  }

  private buildImageUrl(baseUrl: string, availableSizes: string[], desiredSize: number, filePath: string): string {
    const size =
      Math.min(
        ...availableSizes
          .map((s) => Number(s.substring(1)))
          .filter((s) => s > desiredSize)).toString();

    return `${baseUrl}w${size}${filePath}`;
  }

  public render(): JSX.Element {
    return (
      <MovieList movies={this.state.results} />
    );
  }
}
