import * as React from 'react';
import * as classnames from 'classnames';

import { Heart } from '../heart';

const theme = require('./theme.css');

export interface IRatingProps {
  backgroundColor?: string;
  className?: string;
  foregroundColor?: string;
  rating: number;
  ratingMax: number;
};

export const Rating: React.StatelessComponent<IRatingProps> = (props) => {
  return (
    <div className={classnames(theme.rating, props.className)}>
      <div className={theme.heartContainer}>
        <Heart
          className={classnames(theme.heart, theme.absolute)}
          fillColor={props.backgroundColor || '#606060'} />
        <Heart
          className={classnames(theme.heart, theme.absolute)}
          fillPercent={100 - ((props.rating / props.ratingMax) * 100)}
          fillColor={props.foregroundColor || '#ec7053'} />
      </div>
      <span >{props.rating}</span>
    </div>
  );
};
