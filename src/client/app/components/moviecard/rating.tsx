import * as React from 'react';

import { classes, style } from 'typestyle';

export interface IRatingProps {
  backgroundColor?: string;
  foregroundColor?: string;
  formatPercentage?: (percentage: number) => string;
  percentage?: number;
  radius?: number;
  strokeWidth?: number;
  textColor?: string;
  textClassName?: string;
}

namespace RatingStyle {
  export const circleProgressStyle = style({
    fill: 'none',
  });

  export const circleProgressForegroundStyle = style({
    transition: 'stroke-dashoffset .5s ease-in-out',
  });

  export const circleProgressTextStyle = style({
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: 24,
    fontWeight: 600,
    transform: 'translate(0, 50%)',
  });
}

export const Rating: React.StatelessComponent<IRatingProps> = (props) => {
  const correctedRadius = props.radius - props.strokeWidth / 2;
  const width = props.radius * 2;
  const height = props.radius * 2;
  const viewBox = `0 0 ${width} ${height}`;
  const strokeDashArray = correctedRadius * Math.PI * 2;
  const strokeDashOffset = strokeDashArray - strokeDashArray * props.percentage;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}>
      <circle
        className={RatingStyle.circleProgressStyle}
        cx={props.radius}
        cy={props.radius}
        r={correctedRadius}
        strokeWidth={`${props.strokeWidth / 2}px`}
        stroke={props.backgroundColor}/>
      <circle
        className={classes(RatingStyle.circleProgressStyle, RatingStyle.circleProgressForegroundStyle)}
        cx={props.radius}
        cy={props.radius}
        r={correctedRadius}
        strokeWidth={`${props.strokeWidth}px`}
        stroke={props.foregroundColor}
        strokeLinecap="round"
        style={{ strokeDasharray: strokeDashArray, strokeDashoffset: strokeDashOffset }} />
      <text
        className={classes(props.textClassName, RatingStyle.circleProgressTextStyle)}
        dy=".4em"
        fill={props.textColor}
        textAnchor="middle"
        x={props.radius}
        y={props.radius}>
        {props.formatPercentage(props.percentage)}
      </text>
    </svg>
  );
};

Rating.defaultProps = {
  backgroundColor: 'rgba(128, 128, 128, 0.5)',
  foregroundColor: 'white',
  formatPercentage: (p) => p.toString(),
  percentage: 0,
  radius: 42,
  strokeWidth: 1,
  textColor: 'white',
};
