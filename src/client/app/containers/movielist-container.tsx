import * as React from 'react';

import { IPagedCollection, ITmdbConfiguration, ITmdbGenre, ITmdbMovie } from 'models';

import { IMovieCardProps } from '../components';
import { MovieList } from '../components';

export interface IMovieListContainerProps {
  searchToken: string;
}

export interface IMovieListContainerState {
  searchToken?: string;
  results: IMovieCardProps[];
}

export class MovieListContainer extends React.Component<IMovieListContainerProps, IMovieListContainerState> {
  public static defaultProps: IMovieListContainerProps = {
    searchToken: null,
  };

  constructor(props: IMovieListContainerProps) {
    super(props);
    this.state = {
      results: [],
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
    this.search = this.search.bind(this);
  }

  public async componentDidMount() {
    await this.search(this.props.searchToken);
  }

  public async componentWillReceiveProps(nextProps: Readonly<IMovieListContainerProps>, nextContext: any) {
    if (nextProps.searchToken !== this.state.searchToken) {
      await this.search(nextProps.searchToken);
    }
  }
  public async search(name?: string): Promise<IMovieCardProps[]> {
    const pagedMovies: IPagedCollection<ITmdbMovie> = name
      ? await fetch(`/api/v1/movies/?title=${name}`).then<any>((res) => res.json())
      : await fetch('/api/v1/movies/popular').then<any>((res) => res.json());

    const configuration: ITmdbConfiguration = await fetch('/api/v1/configuration').then<any>((res) => res.json());
    const genres: ITmdbGenre[] = await fetch('/api/v1/movies/genres').then<any>((res) => res.json());
    const mappedGenres = new Map<number, string>(genres.map<[number, string]>((g) => [g.id, g.name]));

    const minVotes = 15;

    const shouldFilter =
       pagedMovies.results
        .filter((tmdbMovie) => tmdbMovie.vote_count > minVotes).length > 0;

    const results =
      pagedMovies.results
        .filter((tmdbMovie) => !shouldFilter || tmdbMovie.vote_count > minVotes)
        .map((tmdbMovie) => {
          return {
            key: tmdbMovie.id,
            movieId: tmdbMovie.id,
            title: tmdbMovie.title,
            year: tmdbMovie.release_date.substring(0, 4),
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
        });

    const backdrops = pagedMovies.results.map((tmdbMovie) => {
      return this.buildImageUrl(
        configuration.images.secure_base_url,
        configuration.images.backdrop_sizes,
        1280,
        tmdbMovie.backdrop_path);
    });

    this.setState({
      searchToken: name,
      results,
    });

    return results;
  }

  private getGenreNames(genreIds: number[], genres: Map<number, string>): string[] {
    if (!genreIds || !genres) {
      return [];
    }

    return genreIds.map((genreId) => genres.get(genreId)).sort((a, b) => a > b ? 1 : -1);
  }

  private buildImageUrl(baseUrl: string, availableSizes: string[], desiredSize: number, filePath: string): string {
    if (filePath == null) {
      return null;
    }

    const size =
      Math.min(
        ...availableSizes
          .map((s) => Number(s.substring(1)))
          .filter((s) => s >= desiredSize)).toString();

    return `${baseUrl}w${size}${filePath}`;
  }

  public render(): JSX.Element {
    return (
      <MovieList
        movies={this.state.results} />
    );
  }
}
