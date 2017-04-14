import * as React from 'react';

import { classes, style } from 'typestyle';

const theme = require('./theme.css');

export interface ICardProps {
  className?: string;
}

export const Card: React.StatelessComponent<ICardProps> = (props) => {
  return (
    <div className={classes(props.className, theme.card)} >
      {props.children}
    </div>
  );
};
