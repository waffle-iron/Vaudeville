import * as React from 'react';
import * as classnames from 'classnames';

export interface IFontIconProps {
  className?: string;
  value: string;
}

export const FontIcon: React.StatelessComponent<IFontIconProps> = (props) => {
  return (
    <span
      aria-label={props.value}
      className={classnames('material-icons', props.className)}>
      <span aria-hidden="true">{props.value}</span>
    </span>
  );
};
