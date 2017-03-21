import * as React from 'react';

import { IMovieCardProps, MovieCard } from '../moviecard';

const theme = require('./theme.css');

export interface IMovieListProps {
  movies: IMovieCardProps[];
  ratingMax?: number;
};

export const MovieList: React.StatelessComponent<IMovieListProps> = (props) => {
  const renderMovie = (movie: IMovieCardProps) => {
    const movieStyle: React.CSSProperties = {
      marginBottom: '30px',
    };
    return (
      <span style={movieStyle}>
        <MovieCard
          key={movie.key}
          title={movie.title}
          genres={movie.genres}
          poster={movie.poster ? movie.poster : ''}
          rating={movie.rating}
          ratingMax={props.ratingMax ? props.ratingMax : 10} />
      </span>
    );
  };

  return (
    <div className={theme.movieList}>
      {props.movies.map(renderMovie)}
    </div>
  );
};
