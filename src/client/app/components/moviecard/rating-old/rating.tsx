import * as React from 'react';

import { classes, style } from 'typestyle';

import { Heart } from '../heart';

namespace RatingStyle {
  export const mainStyle = style({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  });

  export const heartsStyle = style({
    display: 'block',
  });

  export const absolute = style({
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  });
}

export interface IRatingProps {
  backgroundColor?: string;
  backgroundOpacity?: number;
  className?: string;
  foregroundColor?: string;
  foregroundOpacity?: number;
  height?: number;
  rating: number;
  width?: number;
};

export const Rating: React.StatelessComponent<IRatingProps> = (props) => {
  const width = props.width;
  const height = props.height;
  const viewBox = `0 0 ${width} ${height}`;
  const heartPath = `M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2,c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z`;

  return (
    <div className={classes(props.className, RatingStyle.mainStyle)}>
      <div className={RatingStyle.heartsStyle}>
        <svg
          className={RatingStyle.absolute}
          viewBox={viewBox}
          fill={props.backgroundColor || '#eee'}
          opacity="0.25"
          height={`${height}px`}
          width={`${width}px`}>
          <path d={heartPath} />
        </svg>
        <svg
          className={RatingStyle.absolute}
          viewBox={viewBox}
          clipPath={`inset(${(100 - props.rating * 100).toString()}% 0 0 0)`}
          fill={props.foregroundColor || 'white'}
          height={`${height}px`}
          width={`${width}px`}>
          <path d={heartPath} />
        </svg>
      </div>
    </div>
  );
};

Rating.defaultProps = {
  backgroundColor: '#ddd',
  backgroundOpacity: 0.8,
  foregroundColor: '#fff',
  foregroundOpacity: 1,
  height: 30,
  width: 32,
  rating: 1,
}
