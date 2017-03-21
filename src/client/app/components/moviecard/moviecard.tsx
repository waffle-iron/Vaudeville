import * as React from 'react';
import * as classnames from 'classnames';

import { Card } from '../../components';
import { Rating } from './rating';

const theme = require('./theme.css');

export interface IMovieCardProps {
  key: number;
  title: string;
  genres: string[];
  poster?: string;
  rating: number;
  ratingMax?: number;
};

export const MovieCard: React.StatelessComponent<IMovieCardProps> = (props) => {
  const capitalize = (value: string) => {
    return value.charAt(0).toUpperCase() + value.substr(1);
  };

  return (
    <Card className={theme.movieCard}>
      <img className={theme.poster} src={props.poster ? props.poster : ''} />
      <div className={theme.info}>
        <span className={classnames(theme.infoTitle, theme.overflowEllipsis)}>
          {props.title}
        </span>
        <span className={classnames(theme.infoGenres, theme.overflowEllipsis)}>
          {props.genres.map((genre) => capitalize(genre)).join(', ')}
        </span>
        <Rating rating={props.rating} ratingMax={props.ratingMax ? props.ratingMax : 10} />
      </div>
    </Card>
  );
};
