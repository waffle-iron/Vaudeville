import * as React from 'react';

import { IMovieCardProps, MovieCard } from '../moviecard';
import { classes, cssRule, style } from 'typestyle';

export interface IMovieListProps {
  movies: IMovieCardProps[];
  moviesPerRow?: number;
  movieHeight?: number;
  moviePadding?: number;
  movieWidth?: number;
  movieRowSpacing?: number;
  ratingMax?: number;
  qualities: string[];
}

namespace MovieListStyle {
  export const movieList = style({
    display: 'inline-flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  });

  export const movie = (props: IMovieListProps) => style({
      $debugName: 'movie',
      display: 'flex',
      boxSizing: 'border-box',
      flexBasis: `${100 / props.moviesPerRow}%`,
      justifyContent: 'space-around',
      marginBottom: `${props.movieRowSpacing}px`,
      paddingLeft: `${props.moviePadding}px`,
      paddingRight: `${props.moviePadding}px`,
      $nest: {
        '&:empty': {
          height: 0,
          margin: 0,
          minWidth: props.movieWidth + props.moviePadding * 2,
        },
      },
    });

}

export class MovieList extends React.Component<IMovieListProps, {}> {
  public static defaultProps: IMovieListProps = {
    movies: [],
    moviesPerRow: 8,
    movieHeight: 201,
    moviePadding: 12,
    movieWidth: 134,
    movieRowSpacing: 30,
    ratingMax: 10,
    qualities: [],
  };

  constructor(props: IMovieListProps) {
    super(props);
    this.state = { currentBackdrop: '' };
    this.renderMovie = this.renderMovie.bind(this);
  }

  private renderMovie(movie: IMovieCardProps): JSX.Element {

    return (
        <MovieCard
          className={MovieListStyle.movie(this.props)}
          key={movie.movieId}
          movieId={movie.movieId}
          title={movie.title}
          year={movie.year}
          genres={movie.genres}
          poster={movie.poster ? movie.poster : ''}
          defaultQuality={movie.defaultQuality}
          qualities={this.props.qualities}
          rating={movie.rating}
          ratingMax={this.props.ratingMax}
          width={this.props.movieWidth}
          height={this.props.movieHeight}/>
    );
  }

  public render(): JSX.Element {
    const emptyMovieElements: JSX.Element[] = [];
    for (let i = 0; i < this.props.moviesPerRow; i++) {
      emptyMovieElements.push((<div className={MovieListStyle.movie(this.props)} key={`empty${i}`}/>));
    }
    return (
      <div className={MovieListStyle.movieList}>
        {this.props.movies.map(this.renderMovie)}
        {emptyMovieElements}
      </div>
    );
  }
};
