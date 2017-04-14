import * as React from 'react';

import { classes, style } from 'typestyle';

import { Card } from '../../components';
import { Rating } from './rating-old';

export interface IMovieCardProps {
  className?: string;
  genres: string[];
  height?: number;
  movieId: number;
  poster?: string;
  rating: number;
  ratingMax?: number;
  title: string;
  width?: number;
  year: string;
};

namespace MovieCardStyle {
  export const borderRadius = style({ backgroundColor: 'transparent', borderRadius: 3 });

  export const overlay = style({
    opacity: 0,
    transition: 'all .2s',
  });

  export const cover = style({
    bottom: 0,
    height: '100%',
    left: 0,
    opacity: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  });

  export const darkenOverlay = style({
    background: 'radial-gradient(farthest-corner at 50% 50%,rgba(50,50,50,.5) 50%,#323232 100%) !important',
  });

  export const borderOverlay = style({
    borderWidth: '2px',
    borderColor: '#10fda1',
    borderStyle: 'solid',
  });

  export const downloadButton = style({
    backgroundColor: 'rgba(0, 0, 0, .45)',
    border: '2px solid rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 12,
    height: 42,
    opacity: 0,
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    left: '50%',
    transition: 'all .2s',
    transform: 'translate(-50%, -50%) scale(0.8)',
    width: 42,
    $nest: {
      '&:hover': {
        backgroundColor: '#10fda1',
        color: 'white',
        borderColor: '#10fda1',
      }
    },
  });

  export const main = style({
    display: 'flex',
    flexDirection: 'column',
  });

  export const poster = (props: IMovieCardProps) => style({ height: props.height, width: props.width });

  export const card = (props: IMovieCardProps) => style({
    boxShadow: `0 6px 10px 0 rgba(0, 0, 0, 0.14),
                0 1px 18px 0 rgba(0, 0, 0, 0.12),
                0 3px 5px -1px rgba(0, 0, 0, 0.2)`,
    display: 'flex',
    flexDirection: 'column',
    height: props.height,
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    width: props.width,
    $nest: {
      [`&:hover .overlay.${MovieCardStyle.overlay}`]: {
        opacity: 1,
      },
      [`&:hover .overlay.${MovieCardStyle.borderOverlay}`]: {
        opacity: 1,
      },
      [`&:hover .overlay.${MovieCardStyle.downloadButton}`]: {
        opacity: 1,
        transform: 'translate(-50%, -50%) scale(1)',
      },
    },
  });

  export const title = (props: IMovieCardProps) => style({
    color: '#e7e7e7',
    display: 'block',
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: 14,
    fontWeight: 600,
    marginTop: 12,
    textAlign: 'left',
    textShadow: 'black -1px 1px 5px',
    width: props.width,
  });

  export const year = (props: IMovieCardProps) => style({
    color: '#555',
    display: 'block',
    fontFamily: `'Open Sans', sans-serif`,
    fontSize: 13,
    fontWeight: 600,
    marginTop: 3,
    textAlign: 'left',
    textShadow: 'black -1px 1px 5px',
    width: props.width,
  });

  export const ellipsesOverflow = style({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });
}

export const MovieCard: React.StatelessComponent<IMovieCardProps> = (props) => {
  const formatPercentage = (percentage: number) => (percentage * props.ratingMax).toPrecision(2);

  const downloadTorrent = async() => {
    await fetch(`/api/v1/torrents/download/${props.movieId}`).then<any>((res) => res.json());
  };

  const overlayClasses = classes(
    'overlay',
    MovieCardStyle.borderRadius,
    MovieCardStyle.darkenOverlay,
    MovieCardStyle.borderOverlay,
    MovieCardStyle.cover,
    MovieCardStyle.overlay,
  );

  return (
    <div className={props.className}>
      <div className={MovieCardStyle.main}>
        <div onClick={downloadTorrent}>
          <Card className={classes(MovieCardStyle.borderRadius, MovieCardStyle.card(props))}>
            <img
              className={classes(MovieCardStyle.borderRadius, MovieCardStyle.poster(props))}
              src={props.poster ? props.poster : ''} />
            <div className={overlayClasses} />
            <div className={classes('overlay', MovieCardStyle.downloadButton)}>
              <i className="material-icons">file_download</i>
            </div>
          </Card>
        </div>
        <span className={classes(MovieCardStyle.title(props), MovieCardStyle.ellipsesOverflow)}>
          {props.title}
        </span>
        <span className={classes(MovieCardStyle.year(props), MovieCardStyle.ellipsesOverflow)}>
          {props.year}
        </span>
      </div>
    </div>
  );
};

MovieCard.defaultProps = {
  height: 201,
  width: 134,
}

