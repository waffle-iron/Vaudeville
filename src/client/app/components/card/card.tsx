import * as React from 'react';
import * as classnames from 'classnames';

const theme = require('./theme.css');

export interface ICardProps {
  className?: string;
}

export const Card: React.StatelessComponent<ICardProps> = (props) => {
  return (
    <div className={classnames(theme.card, props.className)}>
      {props.children}
    </div>
  );
};
